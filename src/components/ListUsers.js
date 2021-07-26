import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";

const ListUsers = () => {
    const history = useHistory();
    const [dataUser, setDataUser] = useState([]);
    const [lgShowUser, setLgShowUser] = useState(false);
    const [showDeleteUser, setShowDeleteUser] = useState(false);

    const [idDeleteUser, setIdDeleteUser] = useState('');

    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleCloseUser = () => {
        setShowDeleteUser(false)

    }

    const handleShowDeleteUser = (id) => {
        setShowDeleteUser(true);
        setIdDeleteUser(id)
    }

    const handleDeleteUser = () => {
        const token = localStorage.getItem('dataLogin');
        const dataSend = {
            id_user: idDeleteUser,
            token: token
        }
        fetch(`${process.env.REACT_APP_API}/hapusAdmin`, {
            method: 'POST',
            body: JSON.stringify(dataSend),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(hasil => {
                getDataUser();
                setShowDeleteUser(false);
                swal("Success", hasil.message, "success")
                console.log(hasil)
            })
            .catch(err => {
                alert(err)
            })
    }

    const handleSubmitUser = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('dataLogin');
        const dataSend = {
            nama: nama,
            email: email,
            password: password,
            token: token
        }

        if (nama === '' || email === '' || password === '') {
            swal("Failed", "Form harus diisi semua", "error")
            return;
        }
        // console.log(judul)
        fetch(`${process.env.REACT_APP_API}/tambahAdmin`, {
            method: "POST",
            body: JSON.stringify(dataSend),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(hasil => {

                // console.log('hasil =>', hasil)
                setLgShowUser(false);
                if (hasil.status === 'berhasil') {
                    swal("Success", hasil.message, "success")
                    getDataUser()
                    clearStateUser()
                } else {
                    swal("Failed", hasil.message.email[0], "error")
                    // console.log(hasil);
                }

            })
    }

    const clearStateUser = () => {
        setNama('')
        setEmail('')
        setPassword('')
    }

    useEffect(() => {
        getDataUser()
    }, [])
    const getDataUser = () => {
        const token = localStorage.getItem('dataLogin');
        const sentData = {
            token
        }
        fetch(`${process.env.REACT_APP_API}/listAdmin`, {
            method: 'POST',
            body: JSON.stringify(sentData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(hasil => {
                // console.log('data', hasil)
                if (hasil.status === 'berhasil') {
                    setDataUser(hasil.data)
                } else {
                    history.push('/login');
                    localStorage.removeItem('dataLogin');
                }

            })
            .catch(err => {
                alert(err)
            })
    }
    return (
        <>
            {/* modal add video */}
            <Modal
                size="lg"
                show={lgShowUser}
                onHide={() => setLgShowUser(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Tambah User
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>nama</Form.Label>
                            <Form.Control onChange={(e) => setNama(e.target.value)} type="text" placeholder="nama" />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>email</Form.Label>
                            <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email" />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>password</Form.Label>
                            <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
                        </Form.Group>

                        <Button onClick={(e) => handleSubmitUser(e)} variant="primary" type="submit">
                            Simpan
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* modal delete video */}
            <Modal show={showDeleteUser} onHide={handleCloseUser}>
                <Modal.Header closeButton>
                    <Modal.Title>Hapus video</Modal.Title>
                </Modal.Header>
                <Modal.Body>Apa kamu yakin akan menghapus video?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUser}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="container">
                <h1 className="my-5 pb-5 text-center">List User</h1>
                <button onClick={() => setLgShowUser(true)} className="mb-3 btn btn-success rounded">+ Tambah User</button>
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nama</th>
                            <th scope="col">Email</th>
                            <th scope="col">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataUser.map((data, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{data.nama}</td>
                                    <td>{data.email}</td>
                                    <td>
                                        <button onClick={() => handleShowDeleteUser(data.id_user)} className="mx-1 btn btn-danger">Hapus</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ListUsers;