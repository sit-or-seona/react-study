import './Card.css';
import style from './Card.module.css';
import styled from 'styled-components';


const Round = styled.figure`
    border-radius: 0.9rem;
`;

const Strong = styled.strong`
    color: ${props => props.txtColor}
`;

function Card({ title, text, imgUrl }) {

    const txtColor = title === '랫서판다' ? 'red' : title === '북극여우' ? 'blue' : 'yellow';

    return (
        <Round className={`w-1/3 max-w-sm rounded overflow-hidden shadow-lg px-2`}>
            {/* <figure className={`w-1/3 max-w-sm rounded overflow-hidden shadow-lg px-2 ${style.rounded}`}> */}
            <img src={imgUrl} alt="" className="w-full object-cover object-top h-48" />
            <figcaption className="px-6 py-4">
                <Strong txtColor={txtColor} className="font-bold text-xl mb-2">{title}</Strong>
                {/* <strong className="font-bold text-xl mb-2">{title}</strong> */}
                <p className="text-gray-700 text-base">{text}</p>
            </figcaption>
            {/* </figure> */}
        </Round>
    )
}

export default Card;