-- 用户创建 postgresql 容器时，初始化普通用户，内容待定
CREATE USER myapp WITH PASSWORD 's3cr3t';
GRANT CONNECT ON DATABASE tasks TO myapp;
GRANT USAGE ON SCHEMA public TO myapp;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO myapp;