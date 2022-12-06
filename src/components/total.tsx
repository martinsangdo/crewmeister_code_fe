//show total absences, this component get data from redux store
import {useSelector, useDispatch} from 'react-redux';
import React, {useEffect, useState } from 'react';

function TotalComponent(){
    const total = useSelector((state:any)=>state.total_absences);

    return <span>
        {total}
    </span>
}

export default TotalComponent;
