import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="bg-slate-800 h-screen py-6 fixed z-10 mt-14">
            <ul>
                <li className="mb-2">
                    <Link to="/teacher" className="text-white w-full font-semiboldbold hover:bg-orange-700 p-3 flex flex-col gap-2 items-center">

                    <img className='w-9 h-7' src="data:image/png;base64,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" alt="" />
                    Dashboard
                   
                    </Link>
                </li>
                <li>
                    <Link to="/salary" className="text-white w-full font-semiboldbold hover:bg-orange-700 p-3 flex flex-col gap-2 items-center">
                    <img className='w-9' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAXCAYAAABj7u2bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG+SURBVHgBvVeBcYMwDBS9DMAI7gRlg7obZIRkgqYTJJ0g1wnSTcIG0AnMBskGrnTIieAMCJf07/4cbFmS5TcmGUTgvTfY7JEWlscVWSM/syxrJq0xmQJ58Y8HxSj68bNIQg4bg2yQX7yiJZEj30MMrNLzoCUmY8UKDDwIvAsBnSqthiZp9hed0WoLJqHGeeXUPLSpcW54zMcC3CoE08mQrYtow8W0EZkfYGX/EySAA56h1QGhgfbkAPdV/UBJ0FZIVMbJwKyN29iEj2iFZieEQ+sx4fuuYO2In8W2LOijjAmfBAv37bMwE0kaYuQjY8nvrpSEGm6LgS2jPsuPNfwFCaKuZFL0+99FzXZS2IQzJyfvwGLCx2KiJpB+pE4stGIPurrCXfyzsJppTys7YrMTXSXyh3+/cHKU2AltX/HUbSEVvXeIiYzvxfi3b++yvo3hsYDTgE10y2JJuSBK5A65YR6FkwNML+4g7YWfjVcKPzjqC7aPEpTwrdjHsNY6MuzMMS/qEnf9yO8rJ3ge8hMVNV8Jb8IxnZiKH6MvRAW2mm8lFTCB3Me/fbRwoESmNeSq0IkxMA90fXyo/mEgfgGRiDGPU3BpPgAAAABJRU5ErkJggg==" alt="" />
                        Salary
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
