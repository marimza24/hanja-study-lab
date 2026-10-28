const json = (body, status = 200) => Response.json(body, {
  status,
  headers: { "Cache-Control": "no-store" }
});
const cleanText = (value, max = 35) => String(value ?? "").replace(/[<>\\u0000-\\u001f]/g, "").trim().slice(0, max);
const allowedOptions = new Set(["生", "學", "國", "心"]);

function supabaseConfig() {
  const url = Netlify.env.get("SUPABASE_URL");
  const key = Netlify.env.get("SUPABASE_ANON_KEY");
  if (!url || !key) throw new Error("Falta configurar Supabase en Netlify");
  return { url: url.replace(/\\/$/, ""), key };
}
async function dbRequest(path, options = {}) {
  const { url, key } = supabaseConfig();
  const response = await fetch(url + "/rest/v1/" + path, {
    ...options,
    headers: {
      apikey: key,
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      ...options.headers
    }
  });
  if (!response.ok) {
    const details = await response.text();
    console.error("Supabase REST error", response.status, details);
    throw new Error("Supabase request failed: " + response.status);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
export default async (request) => {
  try {
    const url = new URL(request.url);
    if (request.method === "GET" && url.searchParams.get("action") === "scores") {
      const rows = await dbRequest("hanja_scores?select=player_name,score,hits,total_questions,seconds,played_at&order=score.desc,seconds.asc,played_at.asc&limit=100");
      return json(rows.map(row => ({
        name: row.player_name,
        score: row.score,
        hits: row.hits,
        total: row.total_questions,
        seconds: row.seconds,
        date: row.played_at ? row.played_at.slice(0, 10) : ""
      })));
    }
    if (request.method === "GET" && url.searchParams.get("action") === "poll") {
      const week = cleanText(url.searchParams.get("week"), 30);
      const voterId = cleanText(url.searchParams.get("voterId"), 100);
      if (!/^\\d{4}-semana-\\d{1,2}$/.test(week)) return json({ error: "Semana inválida" }, 400);
      const rows = await dbRequest("hanja_votes?select=option_char,voter_id&week_key=eq." + encodeURIComponent(week));
      const counts = {};
      for (const row of rows) counts[row.option_char] = (counts[row.option_char] || 0) + 1;
      const myVote = rows.find(row => row.voter_id === voterId)?.option_char ?? null;
      return json({ counts, total: rows.length, myVote });
    }
    if (request.method === "POST") {
      const body = await request.json();
      if (body.type === "vote") {
        const week = cleanText(body.week, 30);
        const char = cleanText(body.char, 2);
        const voterId = cleanText(body.voterId, 100);
        const name = cleanText(body.name, 35);
        if (!/^\\d{4}-semana-\\d{1,2}$/.test(week) || !allowedOptions.has(char) || voterId.length < 8) {
          return json({ error: "Datos de voto inválidos" }, 400);
        }
        await dbRequest("hanja_votes?on_conflict=week_key,voter_id", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify([{ week_key: week, voter_id: voterId, voter_name: name || null, option_char: char, updated_at: new Date().toISOString() }])
        });
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
        await dbRequest("hanja_scores", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify([{ player_name: name, score, hits, total_questions: total, seconds }])
        });
        return json({ ok: true }, 201);
      }
      return json({ error: "Tipo de operación no válido" }, 400);
    }
    if (request.method === "DELETE") {
      const expected = Netlify.env.get("HANJA_ADMIN_TOKEN");
      const provided = request.headers.get("x-admin-token");
      if (!expected || !provided || provided !== expected) return json({ error: "No autorizado" }, 401);
      await dbRequest("hanja_votes?id=gt.0", { method: "DELETE", headers: { Prefer: "return=minimal" } });
      await dbRequest("hanja_scores?id=gt.0", { method: "DELETE", headers: { Prefer: "return=minimal" } });
      return json({ ok: true });
    }
    return json({ error: "Método no permitido" }, 405);
  } catch (error) {
    console.error("Hanja shared API error:", error);
    return json({ error: "Servicio temporalmente no disponible" }, 503);
  }
};
