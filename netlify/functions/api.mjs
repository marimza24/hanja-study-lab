import { getDatabase } from "@netlify/database";

const allowedOptions = new Set(["生", "學", "國", "心"]);
const json = (body, status = 200) => Response.json(body, {
  status,
  headers: { "Cache-Control": "no-store" }
});
const cleanText = (value, max = 35) => String(value ?? "").replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, max);

export default async (request, context) => {
  try {
    const db = getDatabase();
    const url = new URL(request.url);

    if (request.method === "GET" && url.searchParams.get("action") === "scores") {
      const rows = await db.sql`
        SELECT player_name AS name, score, hits, total_questions AS total,
               seconds, to_char(played_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS date
        FROM hanja_scores
        ORDER BY score DESC, seconds ASC, played_at ASC
        LIMIT 100
      `;
      return json(rows);
    }

    if (request.method === "GET" && url.searchParams.get("action") === "poll") {
      const week = cleanText(url.searchParams.get("week"), 30);
      const voterId = cleanText(url.searchParams.get("voterId"), 100);
      if (!/^\d{4}-semana-\d{1,2}$/.test(week)) return json({ error: "Semana inválida" }, 400);
      const countsRows = await db.sql`
        SELECT option_char, COUNT(*)::int AS count
        FROM hanja_votes WHERE week_key = ${week}
        GROUP BY option_char
      `;
      const myRows = voterId ? await db.sql`
        SELECT option_char FROM hanja_votes WHERE week_key = ${week} AND voter_id = ${voterId} LIMIT 1
      ` : [];
      const counts = Object.fromEntries(countsRows.map(row => [row.option_char, Number(row.count)]));
      return json({ counts, total: Object.values(counts).reduce((a, b) => a + b, 0), myVote: myRows[0]?.option_char ?? null });
    }

    if (request.method === "POST") {
      const body = await request.json();
      if (body.type === "vote") {
        const week = cleanText(body.week, 30);
        const char = cleanText(body.char, 2);
        const voterId = cleanText(body.voterId, 100);
        const name = cleanText(body.name, 35);
        if (!/^\d{4}-semana-\d{1,2}$/.test(week) || !allowedOptions.has(char) || voterId.length < 8) {
          return json({ error: "Datos de voto inválidos" }, 400);
        }
        await db.sql`
          INSERT INTO hanja_votes (week_key, voter_id, voter_name, option_char)
          VALUES (${week}, ${voterId}, ${name || null}, ${char})
          ON CONFLICT (week_key, voter_id)
          DO UPDATE SET voter_name = EXCLUDED.voter_name, option_char = EXCLUDED.option_char, updated_at = NOW()
        `;
        return json({ ok: true }, 201);
      }

      if (body.type === "score") {
        const name = cleanText(body.name, 35);
        const score = Number(body.score);
        const hits = Number(body.hits);
        const total = Number(body.total);
        const seconds = Number(body.seconds);
        if (!name || !Number.isInteger(score) || score < 0 || score > 5000 ||
            !Number.isInteger(hits) || hits < 0 || hits > 10 ||
            total !== 10 || !Number.isInteger(seconds) || seconds < 0 || seconds > 7200) {
          return json({ error: "Resultado inválido" }, 400);
        }
        await db.sql`
          INSERT INTO hanja_scores (player_name, score, hits, total_questions, seconds)
          VALUES (${name}, ${score}, ${hits}, ${total}, ${seconds})
        `;
        return json({ ok: true }, 201);
      }
      return json({ error: "Tipo de operación no válido" }, 400);
    }

    if (request.method === "DELETE") {
      const expected = Netlify.env.get("HANJA_ADMIN_TOKEN");
      const provided = request.headers.get("x-admin-token");
      if (!expected || !provided || provided !== expected) return json({ error: "No autorizado" }, 401);
      await db.sql`DELETE FROM hanja_votes`;
      await db.sql`DELETE FROM hanja_scores`;
      return json({ ok: true });
    }

    return json({ error: "Método no permitido" }, 405);
  } catch (error) {
    console.error("Hanja shared API error:", error);
    return json({ error: "Servicio temporalmente no disponible" }, 503);
  }
};
