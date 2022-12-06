//show total absences, this component get data from redux store
import {useSelector, useDispatch} from 'react-redux';
import React, {useEffect, useState } from 'react';
import styled from 'styled-components';

function TotalComponent(){
    const total = useSelector((state:any)=>state.total_absences);
    // here is styled components
    const MyCustomSpan = styled.span`
        color: red
    `;
    return <MyCustomSpan>
        {total}
    </MyCustomSpan>
}

export default TotalComponent;
