import React, {useEffect, useState } from 'react';

import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useSelector, useDispatch} from 'react-redux';
import {ACTION_TYPE, DEFAULT_PAGE_LEN, APIS} from '../constant';
import TotalComponent from './total'
import { Pagination } from './pagination';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';    //https://github.com/wojtekmaj/react-daterange-picker

//display list of absences
function Absences() {
    //inline CSS here
    const statusStyle : any = {
        'Confirmed': {color:'blue'},
        'Rejected': {color:'red'}
    };
    //default states
    const[isWaiting, setIsWaiting] = useState(false);
    const[serverMessageError, setServerMessageError] = useState('');

    const[absences, setAbsences] = useState<any[]>([]);
    const[members, setMembers] = useState<any[]>([]);
    const[totalAbsences, setTotalAbsences] = useState(0);
    const[displayingData, setDisplayingData] = useState<any[]>([]);
    //pagination
    const [page, setPage] = useState(1);    //based 1-index
    const totalPages = Math.ceil(totalAbsences / DEFAULT_PAGE_LEN);
    const handlePages = (updatePage: number) => {
        setPage(updatePage);
    };
    //
    const [selectingType, setSelectingType] = useState('');
    //date picker config
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, setStartDate] = useState(''); //yyyy-mm-dd
    const [endDate, setEndDate] = useState(''); //yyyy-mm-dd

    //
    const dispatch = useDispatch(); //link with redux
    //
    function fetchAbsences(){
        if (!isWaiting){
            setIsWaiting(true);
            const apiAddress: string|undefined = process.env.REACT_APP_BACKEND_URI;
            if (!apiAddress) {
                throw 'todo here';
            }
            var uri = apiAddress + APIS.GET_ABSENCES + '?page_limit='+DEFAULT_PAGE_LEN+'&page_index='+(page-1);
            if (selectingType != null && selectingType != ''){
                uri += '&type=' + selectingType;
            }
            if (startDate != ''){
                uri += '&start_date=' + startDate;
            }
            if (endDate != ''){
                uri += '&end_date=' + endDate;
            }
            fetch(uri)
                .then(res => res.json())
                .then(res => {
                    // console.log('BE response', res);
                    setIsWaiting(false);
                    setAbsences(res['absences']);
                    setMembers(res['member_list']);
                    dispatch({
                        type: ACTION_TYPE.SET_TOTAL_ABSENCES,
                        total_absences: res['total']
                    });
                    setTotalAbsences(res['total']);
                    setServerMessageError('');
                })
                .catch(error => {
                    // console.log(error);
                    setIsWaiting(false);
                    setAbsences([]);
                    setMembers([]);
                    dispatch({
                        type: ACTION_TYPE.SET_TOTAL_ABSENCES,
                        total_absences: 0
                    });
                    setTotalAbsences(0);
                    setServerMessageError('Failed to connect to server!');
                });
        }
    };
    //format response data for rendering
    function parseAbsenceList(){
        var latestList : any[] = [];
        //create reference member info
        var memberSet : {[key: string]: any} = {}; //key: userId, value: info
        if (members != null){
            members.map(member=>{
                memberSet[member['userId']] = member;
            });
        }
        //
        absences.map(absence =>{
            latestList.push({...absence,
                'member_name': memberSet[absence['userId']]['name'],
                'member_img': memberSet[absence['userId']]['image'],
                'status':(absence['confirmedAt']!=null&&absence['confirmedAt']!='')?
                    'Confirmed':(absence['rejectedAt']!=null&&absence['rejectedAt']!=''?'Rejected':'Requested')
            });
        });
        var htmlList = latestList.map(item=>{
            return <tr key={item._id}>
                <td><img className='member_avatar' src={item.member_img}/></td>
                <td>{item.member_name}</td>
                <td>{item.type}</td>
                <td>{item.startDate} -&gt; {item.endDate}</td>
                <td>{item.memberNote}</td>
                <td style={statusStyle[item.status]}>{item.status}</td>
                <td>{item.admitterNote}</td>
            </tr>;
        });
        setDisplayingData(htmlList);
    }

    function didUpdate() {
        document.title = 'List of absences';
    };
    //UI loaded
    useEffect(didUpdate, []);
    //format HTML list
    useEffect(parseAbsenceList, [absences]);
    //handle changing in pagination
    useEffect(fetchAbsences, [page, selectingType]);
    //when user choose Type
    function onSelectType(newType: string){
        setSelectingType(newType);
    }
    //when user click Search
    function handleSelectDateRange(e: any){
        var startTime = new Date(e[0]);
        setStartDate(startTime.getFullYear()+'-'+(startTime.getMonth()+1) + '-' + startTime.getDate());
        var endTime = new Date(e[1]);
        setEndDate(endTime.getFullYear()+'-'+(endTime.getMonth()+1) + '-' + endTime.getDate());
        setDateRange(e);
    }
    //when user click Search
    function handleClickSearch(){
        fetchAbsences();
    }
    //illustrate server unavailable
    function handleClickConnectFakeServer(){
        if (!isWaiting) {
            setIsWaiting(true);
            fetch("http://localhost:2232")
                .then(res => res.json())
                .then(res => {
                    console.log('BE response', res);
                    setIsWaiting(false);
                    setServerMessageError('');
                })
                .catch(error => {
                    console.log(error);
                    setIsWaiting(false);
                    setAbsences([]);
                    setMembers([]);
                    dispatch({
                        type: ACTION_TYPE.SET_TOTAL_ABSENCES,
                        total_absences: 0
                    });
                    setTotalAbsences(0);
                    setServerMessageError('Failed to connect to server!');
                });
        }
    }
    //render
        return <Container>
            {/*form to search*/}
            <Row className="m-10 mt-5">
                <Form className="m-2">
                    <Row className="mb-2">
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Date range (who absence in this range): </Form.Label>
                            <div>
                                <DateRangePicker
                                    format={"y-MM-dd"}
                                    onChange={e=>handleSelectDateRange(e)} value={dateRange} />
                            </div>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Type</Form.Label>
                            <Form.Select value={selectingType} onChange={e=>{
                                onSelectType(e.target.value);
                            }}>
                                <option value="">Select all</option>
                                <option value="vacation">vacation</option>
                                <option value="sickness">sickness</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Button variant="primary" type="button" onClick={handleClickSearch}>
                        Search by date
                    </Button>
                    <div className="mt-2">
                        <Button variant="danger" type="button" onClick={handleClickConnectFakeServer}>
                            Get data from dummy server
                        </Button>
                    </div>
                </Form>
                <div>{isWaiting?'Querying data, please wait...':''} {serverMessageError?serverMessageError:''}</div>
            </Row>

            {/*data list to display*/}
            <Row>
                <Table striped bordered hover className="m-2">
                    <thead>
                    <tr>
                        <th>Avatar</th>
                        <th>Member name</th>
                        <th>Type</th>
                        <th>Period</th>
                        <th>Member note</th>
                        <th>Status</th>
                        <th>Admitter note</th>
                    </tr>
                    </thead>
                    <tbody>
                    {displayingData}
                    </tbody>
                </Table>
            </Row>
            {/*pagination*/}
            <Row>
                {totalPages > 1 &&
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    handlePagination={handlePages}
                />}
                <div className="mt-5 mb-5">Total items (Redux, Styled component here): <TotalComponent></TotalComponent></div>
            </Row>
        </Container>
}

export default Absences;


