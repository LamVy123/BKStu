import React from "react"

interface IconProps {
    height : number,
    width : number,
    color : string
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