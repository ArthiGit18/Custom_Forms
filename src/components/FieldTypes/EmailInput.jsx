import React from 'react';
const EmailInput = ({ field, isPreview, value, onChange }) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(field.id, e.target.value);
    }
  };
  return (
    <div className="form-field-render email-field">
      <label>
        {}
        {field.label} {field.required && <span className="required-star">*</span>}
      </label>
      <input
        type="email" 
        placeholder={field.placeholder || 'Enter email address'}
        disabled={!isPreview}
        value={value} 
        onChange={handleChange}
      />
    </div>
  );
};
export default EmailInput;