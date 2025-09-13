import React from 'react';
import { useNavigate } from 'react-router-dom';
import PatientConsultationFormComponent from '../components/PatientConsultationForm';

const PatientConsultationFormPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    // Here you would typically send the data to your backend API
    // For now, we'll just log it and show an alert
    alert('Consultation form submitted successfully! Check the console for details.');
    // Optionally navigate to another page after submission
    // navigate('/consultations');
  };

  const handleCancel = () => {
    navigate('/consultations');
  };

  return (
    <PatientConsultationFormComponent 
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default PatientConsultationFormPage;