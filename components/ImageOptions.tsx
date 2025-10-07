import React from 'react';
import { ImageOptionsState, Language } from '../types';
import { translations } from '../constants';

interface ImageOptionsProps {
    options: ImageOptionsState;
    setOptions: React.Dispatch<React.SetStateAction<ImageOptionsState>>;
    language: Language;
    disabled: boolean;
}

const CheckboxOption: React.FC<{
    id: keyof ImageOptionsState;
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, label, checked, onChange }) => (
    <div className="relative flex items-start">
        <div className="flex h-6 items-center">
            <input
                id={id}
                name={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 rounded border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-[#0017f1] focus:ring-[#0017f1]"
            />
        </div>
        <div className="ml-3 text-sm leading-6">
            <label htmlFor={id} className="font-medium text-zinc-800 dark:text-zinc-300">
                {label}
            </label>
        </div>
    </div>
);

const ImageOptions: React.FC<ImageOptionsProps> = ({ options, setOptions, language, disabled }) => {
    const t = translations[language];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, type } = e.target;
        const key = id as keyof ImageOptionsState;

        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setOptions(prev => {
                if (key === 'whiteBackground' && checked) {
                    return { ...prev, whiteBackground: true, blackBackground: false };
                }
                if (key === 'blackBackground' && checked) {
                    return { ...prev, whiteBackground: false, blackBackground: true };
                }
                return { ...prev, [key]: checked };
            });
        } else {
            const { value } = e.target as HTMLTextAreaElement;
            setOptions(prev => ({ ...prev, [key]: value }));
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-6">
            <div className={`p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <h3 className="text-md font-semibold text-zinc-900 dark:text-zinc-200 mb-4">{t.editOptionsTitle}</h3>
                <div className="space-y-5">
                    <fieldset disabled={disabled}>
                        <legend className="sr-only">{t.editOptionsTitle}</legend>
                        <div className="space-y-3">
                            <CheckboxOption
                                id="removeText"
                                label={t.optionRemoveText}
                                checked={options.removeText}
                                onChange={handleChange}
                            />
                            <CheckboxOption
                                id="whiteBackground"
                                label={t.optionWhiteBackground}
                                checked={options.whiteBackground}
                                onChange={handleChange}
                            />
                            <CheckboxOption
                                id="blackBackground"
                                label={t.optionBlackBackground}
                                checked={options.blackBackground}
                                onChange={handleChange}
                            />
                        </div>
                    </fieldset>
                    <div>
                        <label htmlFor="additionalInstructions" className="block text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300">
                            {t.additionalInstructionsTitle}
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="additionalInstructions"
                                name="additionalInstructions"
                                rows={3}
                                className="block w-full rounded-md border-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-[#0017f1] sm:text-sm sm:leading-6 p-2 disabled:cursor-not-allowed"
                                placeholder={t.additionalInstructionsPlaceholder}
                                value={options.additionalInstructions}
                                onChange={handleChange}
                                disabled={disabled}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageOptions;