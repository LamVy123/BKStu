import { useEffect, useState, useRef } from "react"

interface TextAreaProps {
    className?: string
    id: string
    name: string
    placeholder?: string
    required?: boolean
    disable?: boolean
    defaultValue?: string
}

const TextArea: React.FC<TextAreaProps> = ({ className, id, name, placeholder, required, disable, defaultValue }: TextAreaProps) => {
    const [value, setValue] = useState<string>('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const resizeTextArea = () => {
        if (textAreaRef.current) {

            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    };

    useEffect(() => {
        setValue(defaultValue ? defaultValue : '')
    }, [defaultValue, disable])

    useEffect(resizeTextArea, [value]);

    const defaultClassName = "bg-white border-2 border-solid border-black rounded-md p-2 outline-none focus:border-transparent focus:outline-blue-300 focus:outline-2 focus:ring-2 focus:ring-blue-300 overflow-hidden resize-none disabled:border-gray-300"
    return (
        <>
            <textarea
                id={id} name={name}
                placeholder={placeholder}
                className={defaultClassName + " " + className}
                required={required}
                disabled={disable}
                value={value}
                onChange={(e) => { setValue(e.target.value) }}
                ref={textAreaRef}
                spellCheck={false}
            />
        </>

    )
}

export default TextArea