import React from 'react';
import { useApp } from '../../context/AppContext';
import { DoctorAllergyAlertBanner } from './DoctorAllergyAlertBanner';
import { DoctorPatientLookup } from './DoctorPatientLookup';

export const DoctorPatientLookupView = () => {
  const { selectedPatient } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Flashing Red Critical Allergy Alert Banner at absolute top of patient file */}
      <DoctorAllergyAlertBanner patient={selectedPatient} />

      {/* 2. Patient QR Scanner, Search & Unified Medical Timeline */}
      <DoctorPatientLookup />
    </div>
  );
};
