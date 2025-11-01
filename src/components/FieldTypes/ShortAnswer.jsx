import React from 'react';
const ShortAnswer = ({ field, isPreview , value, onChange}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(field.id, e.target.value);
    }
  };
  return (
    <div className="form-field-render short-answer-field">
      <label>
        {field.label} {field.required && <span className="required-star">*</span>}
      </label>
      <input
        type="text"
        placeholder={field.placeholder || 'Enter short answer'}
        disabled = {!isPreview}
        value={value} 
        onChange={handleChange}
      />
    </div>
  );
};
export default ShortAnswer;