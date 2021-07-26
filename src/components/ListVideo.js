import { Button, Form, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import swal from "sweetalert";
import { Link, useHistory } from "react-router-dom";

const ListVideo = () => {
    const history = useHistory();
    const [dataList, setDataList] = useState([]);

    const [show, setShow] = useState(false);
    const [linkVideo, setLinkVideo] = useState("");
    const [lgShow, setLgShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const [judul, setJudul] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [linkThumbnail, setLinkThumbnail] = useState("");
    const [video, setVideo] = useState("");
    const [idDelete, setIdDelete] = useState('');
    const [idUpdate, setIdUpdate] = useState('');

    const handleClose = () => {
        setShow(false)
        setShowDelete(false)

    }

    const handleShowDelete = (id) => {
        setShowDelete(true)
        setIdDelete(id);
        console.log(idDelete);
    }

    const handleShowEdit = (data) => {
        setShowEdit(true)
        // console.log(data)
        setIdUpdate(data.id_konten);
        setJudul(data.judul);
        setKeterangan(data.keterangan);
        setLinkThumbnail(data.link_thumbnail);
        setVideo(data.link_video);
    }
    console.log(idDelete)

    const handleOpen = (data) => {
        setShow(true)
        console.log(data)
        setLinkVideo(data.link_video)
    }

    const handleDelete = () => {
        const token = localStorage.getItem('dataLogin');
        const dataSend = {
            id_konten: idDelete,
            token: token
        }
        fetch(`${process.env.REACT_APP_API}/hapusKonten`, {
            method: 'POST',
            body: JSON.stringify(dataSend),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(hasil => {
                getData();
                setShowDelete(false);
                swal("Success", hasil.message, "success")
                console.log(hasil)
            })
            .catch(err => {
                alert(err)
            })
    }

    useEffect(() => {
        const login = localStorage.getItem('dataLogin')
        if (!login) {
            history.push('/login')
        }
        getData()
    }, [])

    const getData = () => {
        const token = localStorage.getItem('dataLogin');
        const sentData = {
            token
        }
        fetch(`${process.env.REACT_APP_API}/listKonten`, {
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
                    setDataList(hasil.data)
                } else {
                    localStorage.removeItem('dataLogin');
                    history.push('/login');
                }

            })
            .catch(err => {
                alert(err)
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('dataLogin');
        const dataSend = {
            judul: judul,
            keterangan: keterangan,
            link_thumbnail: linkThumbnail,
            link_video: video,
            token: token
        }

        if (judul === '' || keterangan === '' || linkThumbnail === '' || video === '') {
            swal("Failed", "Form harus diisi semua", "error")
            return;
        }
        // console.log(judul)
        fetch(`${process.env.REACT_APP_API}/tambahKonten`, {
            method: "POST",
            body: JSON.stringify(dataSend),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(hasil => {

                console.log('hasil =>', hasil)
                setLgShow(false);
                if (hasil.status === 'berhasil') {
                    swal("Success", hasil.message, "success")
                    getData()
                    clearState()
                } else {
                    swal("Failed", hasil.message.judul[0], "error")
                }
            })
    }

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('dataLogin');
        const dataSend = {
            id_konten: idUpdate,
            judul: judul,
            keterangan: keterangan,
            link_thumbnail: linkThumbnail,
            link_video: video,
            token: token
        }

        fetch(`${process.env.REACT_APP_API}/ubahKonten`, {
            method: "POST",
            body: JSON.stringify(dataSend),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(hasil => {

                console.log('hasil =>', hasil)
                if (hasil.status === 'berhasil') {
                    swal("Success", hasil.message, "success")
                    getData()
                    clearState()
                    setShowEdit(false);
                } else {
                    swal("Failed", "Gagal update", "error")
                }

            })
    }

    const logOut = () => {
        localStorage.removeItem('dataLogin');
        history.push('/login');
    }

    const clearState = () => {
        setJudul('')
        setKeterangan('')
        setLinkThumbnail('')
        setVideo('')
    }

    return (
        <>
            {/* modal show video */}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Memutar video</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="h-auto">
                        <>
                            <ReactPlayer
                                pip={true}
                                config={{
                                    youtube: {
                                        playerVars: {
                                            showinfo: 1,
                                            origin: window.location.origin
                                        }
                                    }
                                }}
                                width="100%"
                                height="300px"
                                url={`${linkVideo}`}
                            />
                        </>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {/* <Button variant="primary">Understood</Button> */}
                </Modal.Footer>
            </Modal>

            {/* modal add video */}
            <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Tambah Video
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>judul</Form.Label>
                            <Form.Control onChange={(e) => setJudul(e.target.value)} type="text" placeholder="judul" />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>keterangan</Form.Label>
                            <Form.Control onChange={(e) => setKeterangan(e.target.value)} type="text" placeholder="keterangan" />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>link thumbnail</Form.Label>
                            <Form.Control onChange={(e) => setLinkThumbnail(e.target.value)} type="text" placeholder="link thumbnail" />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>link video</Form.Label>
                            <Form.Control onChange={(e) => setVideo(e.target.value)} type="text" placeholder="link video" />
                        </Form.Group>

                        <Button onClick={(e) => handleSubmit(e)} variant="primary" type="submit">
                            Simpan
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* modal edit video */}
            <Modal
                size="lg"
                show={showEdit}
                onHide={() => setShowEdit(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Tambah Video
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>judul</Form.Label>
                            <Form.Control onChange={(e) => setJudul(e.target.value)} type="text" placeholder="judul" value={judul} />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>keterangan</Form.Label>
                            <Form.Control onChange={(e) => setKeterangan(e.target.value)} type="text" placeholder="keterangan" value={keterangan} />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>link thumbnail</Form.Label>
                            <Form.Control onChange={(e) => setLinkThumbnail(e.target.value)} type="text" placeholder="link thumbnail" value={linkThumbnail} />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>link video</Form.Label>
                            <Form.Control onChange={(e) => setVideo(e.target.value)} type="text" placeholder="link video" value={video} />
                        </Form.Group>

                        <Button onClick={handleUpdateSubmit} variant="primary" type="submit">
                            Simpan
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* modal delete video */}
            <Modal show={showDelete} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Hapus video</Modal.Title>
                </Modal.Header>
                <Modal.Body>Apa kamu yakin akan menghapus video?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>


            <div className="jumbotron">
                <h1 className="display-4">Hello, Niomic!</h1>
                <p className="lead">Ini adalah contoh media pembelajaran, Aplikasi sederhana yang dapat melakukan CRUD video untuk pembelajaran</p>
                <hr className="my-4" />
                <p>Aplikasi ini menggunakan react bootstrap sebagai framework css dan package player untuk memutar video</p>
                <button onClick={() => setLgShow(true)} className="btn btn-primary btn-lg" role="button">+ Tambah Video</button>
                <Link to="/list-user" className="btn btn-success btn-lg ml-3" role="button">Pengguna</Link>
                <button onClick={() => logOut()} className="btn btn-danger btn-lg ml-3" role="button">Logout</button>

            </div>

            <div className="row justify-content-center">
                {dataList ?
                    dataList.map((data, index) => {
                        return (
                            <div key={index} className="card m-3 col-md-4 col-lg-3 " style={{ width: "18rem", height: "auto", border: "none" }}>
                                <img onClick={() => handleOpen(data)} src={data.link_thumbnail} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title">{data.judul}</h5>
                                    <p className="card-text">{data.keterangan}</p>
                                    <button onClick={() => handleShowDelete(data.id_konten)} className="btn btn-danger mr-1 mt-1">Hapus video</button>
                                    <button onClick={() => handleShowEdit(data)} className="btn btn-success mt-1">Edit video</button>
                                </div>
                            </div>
                        )
                    }) : "Loading.."
                }

            </div>

        </>
    )
}


//try
export default ListVideo;