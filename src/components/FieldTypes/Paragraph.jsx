import React from 'react';
const Paragraph = ({ field , isPreview , value, onChange}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(field.id, e.target.value);
    }
  };
  return (
    <div className="form-field-render paragraph-field">
      <label>
        {}
        {field.label} {field.required && <span className="required-star">*</span>}
      </label>
      <textarea
        placeholder={field.placeholder || 'Enter paragraph text'}
        disabled={!isPreview}
        value={value} 
        onChange={handleChange}
      />
    </div>
  );
};
export default Paragraph;