import React from 'react';
import { Link } from 'react-router-dom';

const ChildSidebar = () => {
    return (
        <div className="bg-slate-800 h-screen py-6 fixed z-10 mt-8 ">
            <ul>
                <li className='flex justify-center'>
                    <Link to="/teacher" className='text-8xl text-center w-full flex flex-col items-center  text-white'>
                    ‹
                    <hr className='bg-white w-[70%] m-3' />

                    </Link>
                </li>
                <li className="mb-2">
                    <Link to="/teacher" className="text-white w-full font-semiboldbold hover:bg-orange-700 p-3 flex flex-col gap-2 items-center">
                        <img className='w-9' src="data:image/png;base64,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" alt="" />
                        Coins

                    </Link>
                </li>
                <li>
                    <Link to="/salary" className="text-white w-full font-semiboldbold hover:bg-orange-700 p-3 flex flex-col gap-2 items-center">
                        <img className='w-9' src="data:image/png;base64,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" alt="" />
                        Loyihalar
                    </Link>
                </li>

                <li>
                    <Link to="/salary" className="text-white w-full font-semiboldbold hover:bg-orange-700 p-3 flex flex-col gap-2 items-center">
                        <img className='w-9' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGzSURBVHgB7VbtVYMwFH3x+F9GYAM7Am7QETpCNxAn0A2iE1QnaDfADcAJcIPnezbakOYDEkL/9J6TQyCPvMv7uAHgigxAxIIHXArkvKTxTKPHE3gueQ2WAjlbGyRs2EJukJPK4rh3kFtDTpCDVnPG80pbW1nW89SSEZXWVhuqmPuU6NyMtFtp84MQojMN6Nk3Xd60RxUsQObLY/epze8gExndia8WxpKOh1EzvaNmSqOI83UUbd54uqkyuwlyQjkMCV7+qGiEQgrMaxtYCqo2Xi1pe8ElzyYLsWJOAmKsITnltuVRBkw7HiSCB5gT6su3OOyUsWi5fnCOM0rVRoPpaFVUgxAOIvzyHoZqy2fPO4SV9R7O0/lBaZve7niupNyuNUyEStGfDMT9cNGLu5gQO/Yqot/H40+SjgoyQPnhj974jKRGREKaQ6sGKSK6iheuDZq5oqLVnfQQaX0b/APSiBRGuqWNCLrUG49dFGY8nlCNbriJ5CDjIeQkcuvYp4wk9CuMJHBPfEPXWmX8Ua13NB5sP/QDGJFJgmVvFkCJU054Mt5jOnYQCWEhVEICgim4IgI/w10aU+sSCDMAAAAASUVORK5CYII=" alt="" />
                        Davomat
                    </Link>
                </li>
                <li>
                    <Link to="/salary" className="text-white w-full font-semiboldbold hover:bg-orange-700 p-3 flex flex-col gap-2 items-center">
                        <img className='w-9' src="https://core.marsit.uz/img/exam-logo.8b4a9a65.png" alt="" />
                        Imtihon
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default ChildSidebar;
