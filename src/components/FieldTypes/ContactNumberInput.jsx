import React from 'react';
const ContactNumberInput = ({ field, isPreview, value, onChange }) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(field.id, e.target.value);
    }
  };
  return (
    <div className="form-field-render phone-field">
      <label>
        {}
        {field.label} {field.required && <span className="required-star">*</span>}
      </label>
      <input
        type="tel" 
        placeholder={field.placeholder || 'Enter phone number'}
        disabled={!isPreview}
        value={value} 
        onChange={handleChange}
      />
    </div>
  );
};
export default ContactNumberInput;