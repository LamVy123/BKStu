import { useEffect, useState } from "react"

interface InputProps {
    className?: string,
    type: string,
    id: string,
    name: string,
    placeholder?: string,
    disable?: boolean
    required?: boolean
    defaultValue?: string | number
}

const Input: React.FC<InputProps> = ({ className, type, id, name, placeholder, disable, required, defaultValue }: InputProps) => {
    const [value, setValue] = useState<string | number>('')

    useEffect(() => {
        setValue(defaultValue ? defaultValue : '');
    }, [defaultValue])

    const defaultClassName = "bg-white border-2 border-solid border-black rounded-md p-2 outline-none focus:border-transparent focus:outline-blue-300 focus:outline-2 focus:ring-2 focus:ring-blue-300 disabled:border-gray-300"
    return (
        <input
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            className={defaultClassName + " " + className}
            disabled={disable}
            required={required}
            value={value}
            onChange={(e) => { setValue(e.target.value) }}
            spellCheck={false}
        />
    )
}

export default Input