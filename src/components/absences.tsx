import React from 'react';

import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import {useSelector} from 'react-redux';

//display list of absences
export default class Absences extends React.Component{
    constructor(props: {} | Readonly<{}>) {
        super(props);
        document.title = 'List of absences';
    }

    render() {
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
            </Row>
            {/*data list to display*/}
            <Row>
                <Table striped bordered hover className="m-2">
                    <thead>
                    <tr>
                        <th>Member name</th>
                        <th>Type</th>
                        <th>Period</th>
                        <th>Member note</th>
                        <th>Status</th>
                        <th>Admitter note</th>
                    </tr>
                    </thead>
                    <tbody>

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
}
