import React, { useState, useContext, useEffect, useCallback } from 'react';
import styled, { ThemeContext } from 'styled-components';
import InfoPopup from './InfoPopup';
import { VerticalFlexBox } from "../../reusable-styles";
import DistributionGraph from './DistributionGraph';
import {Form}from 'react-bootstrap';
export const DisabledOverlay = styled.div<{ display: string }>`
    ${VerticalFlexBox}
    display: ${props => props.display};
    background-image: radial-gradient(${props => props.theme.white},transparent);
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    text-align: center;
    color: ${props => props.theme.black};
`;
export const Container = styled.div`
    position: relative;
    min-height: 10.7rem;
    max-height: 10.7rem;
    width:100%;
`;

export const BlurContainer = styled.div<{ blur: boolean }>`
    ${VerticalFlexBox}
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right:0;
    filter: ${props => props.blur ? `blur(4px)` : ``};
    flex-wrap: wrap;
    box-shadow: 1px 3px 3px rgba(0,0,0,0.25);
    border-radius: 1rem;
    border-color: rgb(255,255,255,0.5);
    border-style: solid;
    border-width: 0.01rem;
    margin: 0.5rem 0;
    box-sizing: border-box;
    padding: 0.5rem;
    background: white;
`;


const TopRightNumber = styled.div`
    position: absolute;
    top: -0.3rem;
    right: 0.5rem;
    font-size: ${props => props.theme.font1};
    color: ${props => props.theme.black};
`;
const TopLeftLabel = styled.div`
    position: absolute;
    top: -0.3rem;
    left: 0.5rem;
    font-size: ${props => props.theme.font2};
    color: ${props => props.theme.black};
`;
const Slider = styled.input`
    width:70vw;
    margin: 3rem 0 0 0;
`;
const PreciseValueArea = styled.input`
    background: white;
    font-size: ${props => props.theme.font3};
    color: ${props => props.theme.black};
    border-radius: 0.5rem;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-style: none;
    padding:0 0.5rem;
    margin: 0;
    width:15vw;
    :hover{
        color: ${props => props.theme.red};
    }
`;
export const MainTextArea = styled.div`
    font-size: ${props => props.theme.font3};
    color: ${props => props.theme.black};
    max-width: 60%;
    width: 100%;
`;

interface DataInputContainerProps {
    distributionMap?: Array<number>,
    topRightNumber?: number,
    topLeftString?: string,
    min: number,
    max: number,
    mainText: string,
    sliderValue: number,
    sliderOnChange: any,
    disabled: boolean,
    sliderValueSet: (...args: any[]) => void,
}
const DataInputContainer: React.FunctionComponent<DataInputContainerProps> = ({
    children,
    distributionMap,
    topRightNumber,
    topLeftString,
    min,
    max,
    mainText,
    sliderValue,
    sliderOnChange,
    disabled,
    sliderValueSet,
}) => {

    const [topRightString, setTopRightString] = useState<string | null>(null);

    //make sure sliderValue is always within min and max
    //run on mount
    useEffect(() => {
        if (min && max && sliderValue) {
            //if it is not, set it to the closest allowed value
            if (max < sliderValue) {
                sliderValueSet(max);
            }
            if (sliderValue < min) {
                sliderValueSet(min);
            }
        }
        //convert topRightNumber if it exists to a less precise number
        if (topRightNumber !== null && topRightNumber !== undefined) {
            setTopRightString(topRightNumber.toFixed(2) + '%');
        }
    }, []);

    return (
        <Container>
            <DisabledOverlay display={disabled ? 'flex' : 'none'}>Select an 'importance' above 0 to change this value.</DisabledOverlay>
            <BlurContainer blur={disabled}>
                {distributionMap ?
                    <DistributionGraph distributionMap={distributionMap}/>
                    : <></>}
                {topLeftString ?
                    <TopLeftLabel>{topLeftString}</TopLeftLabel>
                    : <></>
                }
                {topRightString ?
                    <TopRightNumber>{topRightString}</TopRightNumber>
                    : <></>}
                    <Form>
                <Form.Control
                    type="range"
                    onChange={sliderOnChange}
                    min={min || 0}
                    max={max || 100}
                    step={(max - min) / 100.0}
                    value={sliderValue}
                />
                </Form>
                <PreciseValueArea
                    value={sliderValue.toString()}
                    onChange={sliderOnChange}
                />
                <MainTextArea>{mainText}</MainTextArea>
                <InfoPopup>{children}</InfoPopup>
            </BlurContainer>
        </Container>
    );
}

export default DataInputContainer;
