import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import logo from '../../assets/logo.svg';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import ibgeApi from '../../services/ibgeApi';

import './styles.css';

interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEUFResponse {
    sigla: string
}

interface City {
    id: number,
    nome: string
}

const CreatePoint = () => {
    const history = useHistory();
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedUf, setSelectedUf] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([-23.5630994, -46.6565765]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    useEffect(() => {
        const getItems = async () => {
            const response = await api.get('/items');
            setItems(response.data);
        }

        const getUfs = async () => {
            const response = await ibgeApi.get<IBGEUFResponse[]>('/estados');
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        }
        getItems();
        getUfs();
    }, [])

    useEffect(() => {
        const getCities = async () => {
            const response = await ibgeApi.get(`/estados/${selectedUf}/municipios`);
            setCities(response.data);
        }
        if (selectedUf) {
            getCities();
        }
    }, [selectedUf]);

    function handleSelectUfChange(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value);
    }

    function handleSelectCityChange(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value })
    }

    function handleSelectItem(id: number) {
        if (!selectedItems.includes(id)) {
            setSelectedItems(selectedItems => [...selectedItems, id]);
        } else {
            setSelectedItems(selectedItems.filter((item) => {
                return item !== id;
            }))
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const point = {
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            latitude: selectedPosition[0],
            longitude: selectedPosition[1],
            city: selectedCity,
            uf: selectedUf,
            items: selectedItems
        }
        await api.post('points', point);

        alert('ponto de coleta criado!');

        history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange} />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione um endereço no mapa</span>
                    </legend>

                    <Map center={selectedPosition} zoom={15} onclick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" onChange={handleSelectUfChange}>
                                <option value="0" >Selecione uma UF</option>
                                {
                                    ufs.map(uf => {
                                        return <option key={uf} value={uf}>{uf}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" onChange={handleSelectCityChange}>
                                <option value="0"> Selecione uma cidade</option>
                                {
                                    cities.map(city => {
                                        return <option key={city.id} value={city.nome}>{city.nome}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {
                            items.map(item => {
                                return (
                                    <li
                                        key={item.id}
                                        onClick={() => handleSelectItem(item.id)}
                                        className={selectedItems.includes(item.id) ? 'selected' : ''}
                                    >
                                        <img src={item.image_url} alt={item.title} />
                                        <span>{item.title}</span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
};

export default CreatePoint;