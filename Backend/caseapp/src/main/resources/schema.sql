CREATE TABLE roles (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       reset_token VARCHAR(255),
                       reset_token_expiry DATETIME
);

CREATE TABLE users_roles (
                             user_id BIGINT NOT NULL,
                             role_id BIGINT NOT NULL,
                             PRIMARY KEY (user_id, role_id),
                             FOREIGN KEY (user_id) REFERENCES users(id),
                             FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE cases (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       title VARCHAR(255) NOT NULL,
                       description TEXT,
                       status VARCHAR(50),
                       created_by BIGINT,
                       last_updated DATETIME,
                       FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE case_comments (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               content TEXT,
                               case_id BIGINT,
                               user_id BIGINT,
                               created_at DATETIME,
                               FOREIGN KEY (case_id) REFERENCES cases(id),
                               FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE case_attachments (
                                  id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                  filename VARCHAR(255),
                                  filepath VARCHAR(255),
                                  case_id BIGINT,
                                  uploaded_at DATETIME,
                                  FOREIGN KEY (case_id) REFERENCES cases(id)
);
