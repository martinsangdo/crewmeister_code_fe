import React from 'react';

import Table from 'react-bootstrap/Table';
//display info of member
function Member() {

    return (
        <Table striped bordered hover>
            <tbody>
            <tr>
                <td>3</td>
                <td colSpan={2}>Larry the Bird</td>
                <td>@twitter</td>
            </tr>
            </tbody>
        </Table>
    );
}

export default Member;