-- Clear existing bot types and insert the 10 text-based bots
DELETE FROM bot_types;

INSERT INTO bot_types (name, description, icon, category) VALUES
('Technical Writer', 'Expert technical writer specializing in creating clear, comprehensive documentation, user guides, API documentation, and technical specifications.', 'file-text', 'Professional Services'),
('Business Consultant', 'Seasoned business consultant with expertise in strategy, operations, market analysis, and business development.', 'briefcase', 'Business & Strategy'),
('Creative Writer', 'Creative writer specializing in storytelling, creative content, fiction, poetry, and imaginative writing.', 'pen-tool', 'Creative & Content'),
('Data Analyst', 'Data analyst expert in data interpretation, statistical analysis, reporting, and data visualization.', 'bar-chart', 'Analytics & Research'),
('Marketing Specialist', 'Marketing specialist with expertise in digital marketing, campaign strategy, brand management, and market research.', 'megaphone', 'Marketing & Sales'),
('Legal Assistant', 'Legal assistant with knowledge of legal procedures, document preparation, and legal research.', 'scale', 'Legal & Compliance'),
('Academic Researcher', 'Academic researcher with expertise in research methodology, literature review, academic writing, and scholarly analysis.', 'graduation-cap', 'Education & Research'),
('Software Developer', 'Software developer with expertise in multiple programming languages, software architecture, debugging, and best practices.', 'code', 'Technology & Development'),
('Financial Advisor', 'Financial advisor with expertise in personal finance, investment strategies, budgeting, and financial planning.', 'dollar-sign', 'Finance & Investment'),
('Healthcare Assistant', 'Healthcare assistant with knowledge of medical terminology, health information, and wellness guidance.', 'heart-pulse', 'Health & Wellness');