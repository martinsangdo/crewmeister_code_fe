import React, {useEffect, useState } from 'react';

import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import {useSelector, useDispatch} from 'react-redux';
import {ACTION_TYPE, APIS} from '../constant';

//display list of absences
function Absences() {
    //default states
    const[isWaiting, setIsWaiting] = useState(false);
    const[absences, setAbsences] = useState<any[]>([]);
    const[members, setMembers] = useState<any[]>([]);
    const[totalAbsences, setTotalAbsences] = useState(0);
    const[displayingData, setDisplayingData] = useState<any[]>([]);

    const dispatch = useDispatch(); //link with redux
    //
    function fetchAbsences(){
        if (!isWaiting){
            setIsWaiting(true);
            const apiAddress: string|undefined = process.env.REACT_APP_BACKEND_URI;
            if (!apiAddress) {
                throw 'todo here';
            }
            fetch(apiAddress + APIS.GET_ABSENCES)
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    setIsWaiting(false);
                    setAbsences(res['absences']);
                    setMembers(res['member_list']);
                })
                .catch(error => {
                    console.log(error);
                    setIsWaiting(false);
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
                <td className={item.status}>{item.status}</td>
                <td>{item.admitterNote}</td>
            </tr>;
        });
        setDisplayingData(htmlList);
    }

    function didUpdate() {
        document.title = 'List of absences';
        fetchAbsences();
    };
    //UI loaded
    useEffect(didUpdate, []);
    //
    useEffect(parseAbsenceList, [absences]);
    //render
        return <Container>
            {/*form to search*/}
            <Row className="m-10">
                <Form className="m-2">
                    <Row className="mb-2">
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Member name</Form.Label>
                            <Form.Control/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Type</Form.Label>
                            <Form.Select defaultValue="Choose...">
                                <option>Choose one</option>
                                <option>...</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Button variant="primary" type="button">
                        Search
                    </Button>
                </Form>
                <div>{isWaiting?'Querying data, please wait...':''}</div>
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
                <Pagination className="m-2">
                    <Pagination.First/>
                    <Pagination.Prev/>
                    <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Ellipsis/>

                    <Pagination.Item>{10}</Pagination.Item>
                    <Pagination.Item>{11}</Pagination.Item>
                    <Pagination.Item active>{12}</Pagination.Item>
                    <Pagination.Item>{13}</Pagination.Item>
                    <Pagination.Item disabled>{14}</Pagination.Item>

                    <Pagination.Ellipsis/>
                    <Pagination.Item>{20}</Pagination.Item>
                    <Pagination.Next/>
                    <Pagination.Last/>
                </Pagination>
            </Row>
        </Container>
}

export default Absences;


