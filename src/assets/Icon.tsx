import React from "react"

interface IconProps {
    height : number,
    width : number,
    color? : string
}

export const EmailIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return <svg style={IconStyle} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/> <rect x="3" y="5" width="18" height="14" rx="2" />  <polyline points="3 7 12 13 21 7"/></svg>  
}

export const LockIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />  <path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>  
    )
}

export const UnlockIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />  <path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>
    )
}

export const EyeIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />  <circle cx="12" cy="12" r="3" /></svg>
    )
}

export const EyeOffIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />  <line x1="1" y1="1" x2="23" y2="23" /></svg>
    )
}

export const MenuIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle} viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <line x1="3" y1="12" x2="21" y2="12" />  <line x1="3" y1="6" x2="21" y2="6" />  <line x1="3" y1="18" x2="21" y2="18" /></svg>
    )
}

export const HomeIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle} viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />  <polyline points="9 22 9 12 15 12 15 22" /></svg>
    )
}

export const LoginIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />  <polyline points="10 17 15 12 10 7" />  <line x1="15" y1="12" x2="3" y2="12" /></svg>
    )
}

export const LogoutIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />  <polyline points="16 17 21 12 16 7" />  <line x1="21" y1="12" x2="9" y2="12" /></svg>
    )
}

export const UserIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle}  fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
</svg>

    )
}

export const LoadingIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
    }
    return (
        <svg aria-hidden="true" style={IconStyle} className="inline w-8 h-8 text-white animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
    )
}

export const DashboardIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />  <line x1="3" y1="9" x2="21" y2="9" />  <line x1="9" y1="21" x2="9" y2="9" /></svg>
    )
}

export const StudentsIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="9" cy="7" r="4" />  <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />  <path d="M16 3.13a4 4 0 0 1 0 7.75" />  <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
    )
}

export const TeachersIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle}  fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
    )
}

export const InformationIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <line x1="12" y1="16" x2="12" y2="12" />  <line x1="12" y1="8" x2="12.01" y2="8" /></svg>
    )
}

export const ScheduleIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />  <line x1="16" y1="2" x2="16" y2="6" />  <line x1="8" y1="2" x2="8" y2="6" />  <line x1="3" y1="10" x2="21" y2="10" /></svg>
    )
}

export const ClassIcon : React.FC<IconProps> = (props) => {
    const IconStyle = {
        height : `${props.height * 4}px`,
        width : `${props.width * 4}px`,
        color : `${props.color}`
    }
    return (
        <svg style={IconStyle}  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />  <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />  <line x1="3" y1="6" x2="3" y2="19" />  <line x1="12" y1="6" x2="12" y2="19" />  <line x1="21" y1="6" x2="21" y2="19" /></svg>
    )
}

