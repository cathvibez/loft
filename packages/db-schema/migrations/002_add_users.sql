CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE entries ADD CONSTRAINT fk_entries_user
  FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE objects ADD CONSTRAINT fk_objects_user
  FOREIGN KEY (user_id) REFERENCES users(id);
