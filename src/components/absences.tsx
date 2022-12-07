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
    const[memberSet, setMemberSet] = useState<any>({});
    const[totalAbsences, setTotalAbsences] = useState(0);
    const[displayingData, setDisplayingData] = useState<any[]>([]); //rendering results
    //pagination
    const [page, setPage] = useState(1);    //based 1-index
    const totalPages = Math.ceil(totalAbsences / DEFAULT_PAGE_LEN);
    const handlePages = (updatePage: number) => {
        setPage(updatePage);
    };
    //
    const [selectingType, setSelectingType] = useState(''); //absence type value
    //date picker config
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, setStartDate] = useState(''); //yyyy-mm-dd
    const [endDate, setEndDate] = useState(''); //yyyy-mm-dd

    //
    const dispatch = useDispatch(); //link with redux
    //call to BE to get data with pagination & some conditions
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
                    setIsWaiting(false);
                    setAbsences(res['absences']);
                    setMembers(res['member_list']);
                    dispatch({  //save total results in redux
                        type: ACTION_TYPE.SET_TOTAL_ABSENCES,
                        total_absences: res['total']
                    });
                    setTotalAbsences(res['total']);
                    setServerMessageError('');
                })
                .catch(error => {
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
        var _memberSet : {[key: string]: any} = {}; //key: userId, value: info
        if (members != null){
            members.map(member=>{
                _memberSet[member['userId']] = member;
            });
        }
        setMemberSet(_memberSet);
        //
        absences.map(absence =>{
            latestList.push({...absence,
                'member_name': _memberSet[absence['userId']]['name'],
                'member_img': _memberSet[absence['userId']]['image'],
                'status':mapStatus(absence),
                'duration':(absence['startDate']!=absence['endDate'])?
                        absence['startDate']+' -> '+absence['endDate']:absence['startDate']
            });
        });
        var htmlList = latestList.map(item=>{
            return <tr key={item._id}>
                <td><img className='member_avatar' src={item.member_img}/></td>
                <td>{item.member_name}</td>
                <td>{item.type}</td>
                <td>{item.duration}</td>
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
    //when user chooses Type
    function onSelectType(newType: string){
        setPage(1);
        setSelectingType(newType);
    }
    //when user clicks Search
    function handleSelectDateRange(e: any){
        var startTime = new Date(e[0]);
        setStartDate(startTime.getFullYear()+'-'+(startTime.getMonth()+1) + '-' + startTime.getDate());
        var endTime = new Date(e[1]);
        setEndDate(endTime.getFullYear()+'-'+(endTime.getMonth()+1) + '-' + endTime.getDate());
        setDateRange(e);
    }
    //when user click Search
    function handleClickSearch(){
        setPage(1);
        fetchAbsences();
    }
    //illustrate server unavailable
    function handleClickConnectFakeServer(){
        if (!isWaiting) {
            setIsWaiting(true);
            //call to a dummy server
            fetch("http://localhost:2232")
                .then(res => res.json())
                .then(res => {
                    setIsWaiting(false);
                    setServerMessageError('');
                })
                .catch(error => {
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
    //generate file ics includes confirmed day off of members
    function handleClickGenerateiCal(){
        var lines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0"
        ];
        absences.map(absence=>{
            var status = mapStatus(absence);
            if (status == 'Confirmed'){
                lines.push("BEGIN:VEVENT");
                lines.push("DTSTART:" + absence['startDate'].replaceAll('-',''));
                lines.push("SUMMARY:" + memberSet[absence['userId']]['name']);
                var duration = (absence['startDate']!=absence['endDate'])?
                    absence['startDate']+' -> '+absence['endDate']:absence['startDate']

                lines.push("DESCRIPTION:" + "Duration: "+duration);
                lines.push("END:VEVENT");
            }
        });
        lines.push("END:VCALENDAR");

        var data = lines.join("\n");
        let blob = new Blob([data], { type: 'text/calendar;charset=utf-8' });
        const link: any = document.createElement("a");
        link.download = "download.ics";
        link.href = URL.createObjectURL(blob);
        link.click();
    }
    //
    function mapStatus(absence: any){
        return (absence['confirmedAt']!=null&&absence['confirmedAt']!='')?
            'Confirmed':(absence['rejectedAt']!=null&&absence['rejectedAt']!='')?'Rejected':'Requested';
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
                        Search absences by date
                    </Button>
                    <div className="mt-2">
                        <Button variant="danger" type="button" onClick={handleClickConnectFakeServer}>
                            Get data from dummy server
                        </Button>
                    </div>
                    <div className="mt-2">
                        <Button variant="primary" type="button" onClick={handleClickGenerateiCal}>
                            Generate iCal file for current page
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


