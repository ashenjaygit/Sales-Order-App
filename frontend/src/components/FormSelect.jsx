import React from 'react';

const FormSelect = ({ label, value, onChange, options, placeholder = "Select an option", className = "" }) => {
    return (
        <div className="flex items-center">
            <label className="w-32 text-sm font-semibold text-gray-700">{label}</label>
            <select 
                className={`flex-1 border p-2 border-gray-300 rounded bg-white ${className}`}
                value={value}
                onChange={onChange}
            >
                <option value="">{placeholder}</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
};

export default FormSelect;
