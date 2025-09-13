-- Sample data for MediTrack system

-- Insert default users
INSERT INTO users (username, email, password_hash, full_name, role, department, position) VALUES
('superadmin', 'director@meditrack.com', '$2b$10$k8Y1THPD8MHjHRrj1LqB1eOFEPP.Mv1.7d6yVEm0Uj7BdM3.QRYMC', 'Dr. Sarah Martinez', 'superadmin', 'Administration', 'Medical Director'),
('admin', 'pharmacy@meditrack.com', '$2b$10$k8Y1THPD8MHjHRrj1LqB1eOFEPP.Mv1.7d6yVEm0Uj7BdM3.QRYMC', 'Dr. Emily Rodriguez', 'admin', 'Pharmacy', 'Pharmacy Manager'),
('demo', 'admin@clinic.com', '$2b$10$k8Y1THPD8MHjHRrj1LqB1eOFEPP.Mv1.7d6yVEm0Uj7BdM3.QRYMC', 'Demo User', 'staff', 'General', 'Staff Member');

-- Insert sample patients
INSERT INTO patients (patient_no, first_name, middle_name, last_name, date_of_birth, sex, contact_no, address, course, year_level) VALUES
('PAT2025001', 'John', 'Michael', 'Smith', '2000-03-15', 'Male', '+63 912 345 6789', '123 Main St, Manila, Philippines', 'Computer Science', '4th Year'),
('PAT2025002', 'Maria', 'Elena', 'Garcia', '1999-07-22', 'Female', '+63 917 234 5678', '456 Oak Ave, Quezon City, Philippines', 'Nursing', '3rd Year'),
('PAT2025003', 'Robert', 'James', 'Johnson', '2001-01-10', 'Male', '+63 922 345 6789', '789 Pine St, Makati, Philippines', 'Engineering', '2nd Year'),
('PAT2025004', 'Sarah', 'Anne', 'Williams', '1998-11-05', 'Female', '+63 918 345 6789', '321 Elm St, Pasig, Philippines', 'Medicine', '5th Year'),
('PAT2025005', 'Michael', 'David', 'Brown', '2000-09-18', 'Male', '+63 915 234 5678', '654 Maple Ave, Mandaluyong, Philippines', 'Business', '1st Year');

-- Insert sample medicines
INSERT INTO medicines (medicine_code, name, generic_name, brand_name, category, type, form, strength, quantity, unit_cost, reorder_threshold, expiry_date, requires_prescription) VALUES
('MED001', 'Paracetamol 500 mg tab', 'Paracetamol', 'Biogesic', 'Analgesic/Antipyretic', 'medical', 'Tablet', '500mg', 640, 5.00, 20, '2026-11-30', false),
('MED002', 'Nifedipine 5mg tab', 'Nifedipine', 'Calcigard-5', 'Calcium Channel Blockers', 'medical', 'Tablet', '5mg', 160, 12.50, 25, '2027-05-31', true),
('MED003', 'Nifedipine 10mg tab', 'Nifedipine', 'Calcigard-10', 'Calcium Channel Blockers', 'medical', 'Tablet', '10mg', 0, 8.00, 30, '2027-03-31', true),
('MED004', 'Amlodipine 5mg tab', 'Amlodipine', 'Norvasc', 'Calcium Channel Blockers', 'medical', 'Tablet', '5mg', 350, 15.00, 10, '2027-03-31', true),
('MED005', 'Losartan 50mg tab', 'Losartan', 'Cozaar', 'ACE Inhibitors/ARBs', 'medical', 'Tablet', '50mg', 870, 20.00, 40, '2027-02-28', true),
('MED006', 'Metformin 500mg tab', 'Metformin', 'Glucophage', 'Antidiabetic', 'medical', 'Tablet', '500mg', 1400, 15.00, 30, '2026-12-31', true),
('MED007', 'Omeprazole 20mg cap', 'Omeprazole', 'Losec', 'PPI', 'medical', 'Capsule', '20mg', 420, 20.00, 30, '2026-09-30', true),
('MED008', 'Amoxicillin 500mg cap', 'Amoxicillin', 'Amoxil', 'Antibiotic', 'medical', 'Capsule', '500mg', 700, 12.50, 40, '2026-07-31', true),
('MED009', 'Ibuprofen 400mg tab', 'Ibuprofen', 'Advil', 'Analgesic/Anti-inflammatory', 'medical', 'Tablet', '400mg', 1000, 8.00, 50, '2026-03-31', false),
('MED010', 'Cetirizine 10mg tab', 'Cetirizine', 'Zyrtec', 'Antihistamine', 'medical', 'Tablet', '10mg', 350, 10.00, 25, '2026-05-31', false),
('DEN001', 'Lidocaine 2% injection', 'Lidocaine HCl', 'Xylocaine', 'Local Anesthetic', 'dental', 'Injection', '2%', 50, 15.00, 10, '2026-04-30', true),
('MED011', 'Multivitamin tab', 'Multivitamin', 'Centrum', 'Vitamin/Supplement', 'medical', 'Tablet', '1 tablet', 0, 20.00, 30, '2026-03-31', false);

-- Insert sample consultations
INSERT INTO consultations (consultation_id, patient_id, patient_name, chief_complaint, diagnosis, treatment, doctor, consultation_date, status, vital_signs) VALUES
('CON2025001', (SELECT id FROM patients WHERE patient_no = 'PAT2025001'), 'John Michael Smith', 'Headache and fever for 2 days', 'Viral upper respiratory tract infection', 'Rest, increased fluid intake, paracetamol for fever', 'Dr. Martinez', '2025-01-10 09:30:00+08', 'Completed', '{"blood_pressure": "120/80", "temperature": "38.5°C", "heart_rate": "85 bpm", "respiratory_rate": "18/min"}'),
('CON2025002', (SELECT id FROM patients WHERE patient_no = 'PAT2025002'), 'Maria Elena Garcia', 'Stomach pain after eating', 'Gastritis', 'Omeprazole 20mg BID, avoid spicy foods', 'Dr. Rodriguez', '2025-01-11 14:00:00+08', 'Completed', '{"blood_pressure": "110/70", "temperature": "36.8°C", "heart_rate": "72 bpm", "respiratory_rate": "16/min"}'),
('CON2025003', (SELECT id FROM patients WHERE patient_no = 'PAT2025003'), 'Robert James Johnson', 'Cough and sore throat for 3 days', 'Acute pharyngitis', 'Amoxicillin 500mg TID x 7 days, throat lozenges', 'Dr. Martinez', '2025-01-12 10:15:00+08', 'Completed', '{"blood_pressure": "125/82", "temperature": "37.2°C", "heart_rate": "78 bpm", "respiratory_rate": "20/min"}'),
('CON2025004', (SELECT id FROM patients WHERE patient_no = 'PAT2025004'), 'Sarah Anne Williams', 'Allergic reaction to seafood', 'Allergic urticaria', 'Cetirizine 10mg OD x 5 days, avoid allergens', 'Dr. Rodriguez', '2025-01-13 16:45:00+08', 'Completed', '{"blood_pressure": "115/75", "temperature": "36.9°C", "heart_rate": "88 bpm", "respiratory_rate": "18/min"}'),
('CON2025005', (SELECT id FROM patients WHERE patient_no = 'PAT2025005'), 'Michael David Brown', 'Routine check-up and vaccination', 'Healthy, up-to-date with vaccinations', 'Continue healthy lifestyle, annual check-up', 'Dr. Martinez', '2025-01-14 11:00:00+08', 'Completed', '{"blood_pressure": "118/78", "temperature": "36.7°C", "heart_rate": "75 bpm", "respiratory_rate": "16/min"}');

-- Insert sample supplies
INSERT INTO supplies (supply_code, name, category, type, quantity, unit, unit_cost, supplier, reorder_threshold) VALUES
('SUP001', 'Disposable Syringes 3ml', 'Medical Supplies', 'medical', 500, 'pieces', 2.50, 'MedSupply Corp', 100),
('SUP002', 'Gauze Pads 4x4', 'Medical Supplies', 'medical', 200, 'packs', 15.00, 'Healthcare Supplies Inc', 50),
('SUP003', 'Medical Gloves (Latex)', 'PPE', 'medical', 1000, 'pairs', 1.50, 'SafetyFirst Ltd', 200),
('SUP004', 'Surgical Masks', 'PPE', 'medical', 800, 'pieces', 3.00, 'ProtectMed Co', 150),
('SUP005', 'Alcohol 70%', 'Disinfectants', 'medical', 50, 'bottles', 45.00, 'CleanCare Solutions', 10),
('DSUP001', 'Dental Impression Material', 'Dental Supplies', 'dental', 25, 'kits', 150.00, 'DentalCare Supplies', 5),
('DSUP002', 'Dental Needles', 'Dental Supplies', 'dental', 100, 'pieces', 8.00, 'OralHealth Inc', 20),
('DSUP003', 'Dental Cotton Rolls', 'Dental Supplies', 'dental', 300, 'pieces', 1.25, 'DentSupply Ltd', 50);

-- Insert sample equipment
INSERT INTO equipment (equipment_code, name, category, type, status, location, manufacturer, model, serial_number, purchase_date) VALUES
('EQP001', 'Digital Blood Pressure Monitor', 'Diagnostic Equipment', 'medical', 'Available', 'Medical Room 1', 'Omron', 'HEM-7120', 'OM7120-001', '2024-03-15'),
('EQP002', 'Thermometer (Digital)', 'Diagnostic Equipment', 'medical', 'Available', 'Medical Room 1', 'ThermoTech', 'DT-100', 'TT100-002', '2024-03-20'),
('EQP003', 'Stethoscope', 'Diagnostic Equipment', 'medical', 'Available', 'Medical Room 2', 'Littmann', 'Classic III', 'LC3-003', '2024-02-10'),
('EQP004', 'Examination Table', 'Furniture', 'medical', 'Available', 'Medical Room 1', 'MedFurniture', 'ET-2000', 'MF2000-004', '2024-01-15'),
('EQP005', 'Medical Cabinet', 'Storage', 'medical', 'Available', 'Medical Room 2', 'StoragePro', 'MC-500', 'SP500-005', '2024-02-20'),
('DEQP001', 'Dental Chair', 'Dental Equipment', 'dental', 'Available', 'Dental Room 1', 'DentalTech', 'DC-Pro', 'DT2024-001', '2024-01-30'),
('DEQP002', 'Dental Light', 'Dental Equipment', 'dental', 'Available', 'Dental Room 1', 'BrightDent', 'BL-LED', 'BD2024-002', '2024-02-05'),
('DEQP003', 'Dental X-Ray Machine', 'Diagnostic Equipment', 'dental', 'Maintenance', 'Dental Room 2', 'XRayDent', 'XD-Digital', 'XRD2023-003', '2023-12-15');

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address) VALUES
((SELECT id FROM users WHERE username = 'superadmin'), 'LOGIN', 'USER', (SELECT id FROM users WHERE username = 'superadmin'), '{"success": true, "method": "password"}', '192.168.1.100'),
((SELECT id FROM users WHERE username = 'admin'), 'LOGIN', 'USER', (SELECT id FROM users WHERE username = 'admin'), '{"success": true, "method": "password"}', '192.168.1.101'),
((SELECT id FROM users WHERE username = 'superadmin'), 'CREATE', 'PATIENT', (SELECT id FROM patients WHERE patient_no = 'PAT2025001'), '{"patient_no": "PAT2025001", "name": "John Michael Smith"}', '192.168.1.100'),
((SELECT id FROM users WHERE username = 'admin'), 'UPDATE', 'MEDICINE', (SELECT id FROM medicines WHERE medicine_code = 'MED001'), '{"field": "quantity", "old_value": 500, "new_value": 640}', '192.168.1.101'),
((SELECT id FROM users WHERE username = 'superadmin'), 'CREATE', 'CONSULTATION', (SELECT id FROM consultations WHERE consultation_id = 'CON2025001'), '{"consultation_id": "CON2025001", "patient": "John Michael Smith"}', '192.168.1.100');