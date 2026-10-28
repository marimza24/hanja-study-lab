CREATE TABLE IF NOT EXISTS hanja_scores (
  id BIGSERIAL PRIMARY KEY,
  player_name VARCHAR(35) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 5000),
  hits SMALLINT NOT NULL CHECK (hits >= 0 AND hits <= 10),
  total_questions SMALLINT NOT NULL DEFAULT 10 CHECK (total_questions = 10),
  seconds INTEGER NOT NULL CHECK (seconds >= 0 AND seconds <= 7200),
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS hanja_scores_ranking_idx
  ON hanja_scores (score DESC, seconds ASC, played_at ASC);

CREATE TABLE IF NOT EXISTS hanja_votes (
  id BIGSERIAL PRIMARY KEY,
  week_key VARCHAR(30) NOT NULL,
  voter_id VARCHAR(100) NOT NULL,
  voter_name VARCHAR(35),
  option_char VARCHAR(2) NOT NULL CHECK (option_char IN ('生', '學', '國', '心')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (week_key, voter_id)
);

CREATE INDEX IF NOT EXISTS hanja_votes_week_idx
  ON hanja_votes (week_key, option_char);
