import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addField, reorderFields } from '../redux/actions';
import FormField from './FormField';

const STORAGE_KEY = 'customFormData';

const FormBuilder = () => {
    const dispatch = useDispatch();
    // Use formSchema to represent the structure from Redux
    const formSchema = useSelector((state) => state.form.formFields);
    
    // Note: formFields and formSchema reference the same Redux state, 
    // but formSchema is clearer for mapping the structure.
    const formFields = formSchema; 

    const draggingFieldType = useSelector((state) => state.form.draggingFieldType);
    const [dropIndicatorIndex, setDropIndicatorIndex] = useState(-1);
    const [isReordering, setIsReordering] = useState(false);
    const [draggedFieldIndex, setDraggedFieldIndex] = useState(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    // Local state for storing the ACTUAL form values entered by the user
    const [formValues, setFormValues] = useState({});

    // --- Persistence (Load) ---
    useEffect(() => {
        const storedValues = localStorage.getItem(STORAGE_KEY);
        if (storedValues) {
            setFormValues(JSON.parse(storedValues));
        }
    }, []);

    // --- Persistence (Save) ---
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
    }, [formValues]);


    // Handler to update form values when user types
    const handleValueChange = (fieldId, newValue) => {
        setFormValues(prevValues => ({
            ...prevValues,
            [fieldId]: newValue,
        }));
    };

    // --- Drag and Drop Handlers (All handlers remain correct) ---

    const handleExternalDragOver = (e, index = formFields.length) => {
        e.preventDefault();
        if (draggingFieldType && !isReordering) {
            setDropIndicatorIndex(index);
        }
    };

    // FIX: Add e.stopPropagation() to prevent the drop event from bubbling up and triggering twice
    const handleExternalDrop = (e, index) => {
        e.preventDefault();
        e.stopPropagation(); // <-- CRITICAL FIX
        const fieldType = e.dataTransfer.getData('fieldType');
        if (fieldType) {
            dispatch(addField({ type: fieldType, positionIndex: index }));
        }
        setDropIndicatorIndex(-1);
    };

    const handleDragStart = (e, index) => {
        if (isPreviewMode) return;
        e.stopPropagation();
        setIsReordering(true);
        setDraggedFieldIndex(index);
        e.dataTransfer.setData('fieldIndex', index);
        document.body.classList.add('dragging-reorder');
    };

    const handleDragEnter = (e, index) => {
        e.preventDefault();
        if (isReordering && draggedFieldIndex !== index) {
            setDropIndicatorIndex(index);
        }
    };

    const handleDragEnd = () => {
        setIsReordering(false);
        setDraggedFieldIndex(null);
        setDropIndicatorIndex(-1);
        document.body.classList.remove('dragging-reorder');
    };

    const handleReorderDrop = (e, destinationIndex) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('fieldIndex'));
        if (sourceIndex !== destinationIndex) {
            dispatch(reorderFields(sourceIndex, destinationIndex));
        }
        handleDragEnd();
    };

    // --- Utility Functions ---
    const handleDownload = () => {
        // 1. Process data into a report format
        const reportData = formSchema.map(field => {
            // Get the raw stored value (e.g., "option_field-5_1" or ["option_a", "option_b"])
            const rawValue = formValues[field.id] !== undefined
                ? formValues[field.id]
                : field.value || null;

            let displayValue = rawValue; // Default display value is the raw value

            // Logic to convert internal value back to human-readable label(s) for options fields
            if (field.type === 'Radio Button' && rawValue !== null) {
                // Find the option whose unique value matches the rawValue
                const selectedOption = field.options?.find(opt => opt.value === rawValue);
                if (selectedOption) {
                    displayValue = selectedOption.label; // Use the human-readable label (e.g., "Female")
                }
            } else if (field.type === 'Checkbox' && Array.isArray(rawValue) && rawValue.length > 0) {
                // For checkboxes, map all selected internal values to their labels
                displayValue = field.options
                    .filter(opt => rawValue.includes(opt.value))
                    .map(opt => opt.label); // displayValue becomes an array of labels
            }
            
            return {
                label: field.label,
                type: field.type,
                required: field.required,
                value: displayValue, // Use the human-readable or processed value
            };
        });
        
        // 2. Format the data into an HTML string for PDF compatibility
        let reportItems = '';
        reportData.forEach((item, index) => {
            let valueString;
            
            if (Array.isArray(item.value)) {
                // For checkboxes (array of labels)
                valueString = item.value.length > 0 ? item.value.join(', ') : 'Not selected';
            } else if (item.value !== null && typeof item.value === 'object') {
                // Handle complex objects like Name fields {firstName: '...', lastName: '...'}
                const parts = Object.values(item.value)
                    .filter(val => val && typeof val === 'string')
                    .join(' ');
                
                valueString = parts.length > 0 ? parts : 'No answer provided';

            } else if (item.value === null || item.value === undefined || item.value === '') {
                valueString = 'No answer provided';
            } else {
                valueString = String(item.value);
            }

            // Create HTML structure for each field entry
            reportItems += `
                <div class="field-entry">
                    <div class="field-header">${index + 1}. ${item.label}</div>
                    <div class="field-details">Type: ${item.type} | Required: ${item.required ? 'Yes' : 'No'}</div>
                    <div class="field-response">Response: ${valueString}</div>
                </div>
            `;
        });
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Form Submission Report</title>
                <style>
                    body { font-family: sans-serif; margin: 0; padding: 20px; color: #333; }
                    .report-container { max-width: 800px; margin: 0 auto; }
                    h1 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 30px; }
                    .field-entry { margin-bottom: 25px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 5px; }
                    .field-header { font-weight: bold; font-size: 1.1em; color: #4b5563; margin-bottom: 5px; }
                    .field-details { font-size: 0.9em; color: #6b7280; margin-bottom: 8px; }
                    .field-response { 
                        margin-top: 10px; 
                        padding: 10px; 
                        background-color: #f9fafb; 
                        border-radius: 3px; 
                        white-space: pre-wrap; 
                        word-wrap: break-word; 
                        border-left: 4px solid #3b82f6; /* Accent color for response */
                    }
                    /* Print specific styles */
                    @media print {
                        .field-entry { 
                            border: 1px solid #ccc;
                            page-break-inside: avoid;
                        }
                        .report-container { margin: 0; max-width: 100%; }
                        h1 { border-bottom: 1px solid #ccc; }
                    }
                </style>
            </head>
            <body>
                <div class="report-container">
                    <h1>Form Submission Report</h1>
                    ${reportItems}
                </div>
            </body>
            </html>
        `;


        // 3. Open a new window, write HTML content, and trigger the print dialog (Save as PDF)
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            // Wait for content to load before printing
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };
        } else {
            console.error('Could not open print window. Please allow popups for this site.');
        }
    };

    const togglePreview = () => {
        setIsPreviewMode(!isPreviewMode);
    };

    return (
        <div className="form-builder-wrapper">
            <div className={`form-builder-canvas ${isPreviewMode ? 'preview-mode' : ''}`}
                onDragOver={(e) => handleExternalDragOver(e, formFields.length)}
                onDrop={(e) => handleExternalDrop(e, formFields.length)}
                onDragLeave={() => setDropIndicatorIndex(-1)}>

                <h1>{isPreviewMode ? 'Form Preview' : 'Custom Form Builder'}</h1>

                {formSchema.map((field, index) => { // Use map function directly
                    
                    // CRUCIAL: Define the props needed for both rendering modes here
                    const currentFieldProps = {
                        field: field,
                        // Get the value from local state, defaulting to Redux schema's value or empty string
                        currentValue: formValues[field.id] !== undefined 
                            ? formValues[field.id] 
                            : (field.value || ''), 
                        onValueChange: handleValueChange,
                    };
                    
                    return (
                        <React.Fragment key={field.id}>
                            {/* Drop Indicator above the field */}
                            {dropIndicatorIndex === index && !isPreviewMode && <div className="drop-indicator" />}

                            <div
                                className={`field-wrapper ${draggedFieldIndex === index ? 'dragging-source' : ''}`}
                                draggable={!isPreviewMode}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleExternalDragOver(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDrop={(e) => isReordering ? handleReorderDrop(e, index) : handleExternalDrop(e, index)}
                                onDragLeave={() => setDropIndicatorIndex(-1)}
                                onDragEnd={handleDragEnd}
                            >
                                {/* FIX: Pass all props to FormField in BOTH modes */}
                                {isPreviewMode ? (
                                    <FormField.Render {...currentFieldProps} />
                                ) : (
                                    // In Build Mode, we pass the value to display it, but don't strictly need onChange
                                    <FormField {...currentFieldProps} /> 
                                )}
                            </div>
                        </React.Fragment>
                    );
                })}

                {/* Drop Indicator at the bottom */}
                {formFields.length > 0 && dropIndicatorIndex === formFields.length && !isPreviewMode && <div className="drop-indicator" />}

                {formFields.length === 0 && (
                    <div className="empty-form-message">
                        Drag fields from the palette on the left to build your form.
                    </div>
                )}
            </div>

            <div className="builder-actions">
                <button className="preview-btn" onClick={togglePreview}>
                    <i className="fas fa-eye"></i> {isPreviewMode ? 'Exit Preview' : 'Preview'}
                </button>
                <button className="download-btn" onClick={handleDownload}>
                    <i className="fas fa-print"></i> Print / Save as PDF
                </button>
            </div>
        </div>
    );
};

export default FormBuilder;
