-- Arca Web Database Schema

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- In production, use bcrypt. For now text or simple hash if requested, but plan implies security.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Test Submissions table
CREATE TABLE IF NOT EXISTS test_submissions (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    test_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Storing full raw results as JSONB for flexibility
    -- Structure: { scores: { domains: ..., facets: ..., sdr: ... }, answers: ... }
    results JSONB NOT NULL,
    
    -- Valid flag (e.g. if SDR is valid)
    is_valid BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial Admin (default: admin / arca2026)
-- Password hash should be generated properly. 
-- For this setup, we will insert a placeholder.
INSERT INTO admins (username, password_hash) 
VALUES ('admin', 'arca2026') 
ON CONFLICT (username) DO NOTHING;
