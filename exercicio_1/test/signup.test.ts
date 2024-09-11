import axios from "axios"

axios.defaults.validateStatus = () => true;

test("Testa conta nova Passageiro com sucesso", async () => {
    const body = {     
        name: "Otavio Miranda" , 
        email: `otaviomiranda23${Math.random()}@gmail.com` , 
        cpf: "42906972835", 
        carPlate: "cmg3164" , 
        isPassenger: true , 
        isDriver: false, 
        password: "1234568##Ot"
    }
    const res = await axios.post('http://localhost:3000/signup', body);
    expect(res.data.accountId).toBeDefined();
    const resGetAccount = await axios.get(`http://localhost:3000/signup/${res.data.accountId}`);    
    expect(resGetAccount.data.name).toBe(body.name);
    expect(resGetAccount.data.email).toBe(body.email);
    expect(resGetAccount.data.cpf).toBe(body.cpf);
    expect(resGetAccount.data.car_plate).toBe(body.carPlate);
    expect(resGetAccount.data.is_passenger).toBe(body.isPassenger);
    expect(resGetAccount.data.is_driver).toBe(body.isDriver);
    expect(resGetAccount.data.password).toBe(body.password);
})

test("Testa conta existente Passageiro com sucesso", async () => {
    const body = {     
        name: "Otavio Miranda" , 
        email: `otaviomiranda23@gmail.com` , 
        cpf: "42906972835", 
        carPlate: "cmg3164" , 
        isPassenger: true , 
        isDriver: false, 
        password: "1234568##Ot"
    }
    const res = await axios.post('http://localhost:3000/signup', body);
    expect(res.status).toBe(409);
    expect(res.data.message).toEqual("Account already exists");
})

test("Testa nome inválido", async () => {
    const body = {     
        name: "Otavio" , 
        email: `otaviomiranda23${Math.random()}@gmail.com` , 
        cpf: "42906972835", 
        carPlate: "cmg3164" , 
        isPassenger: true , 
        isDriver: false, 
        password: "1234568##Ot"
    }
    const res = await axios.post('http://localhost:3000/signup', body);
    expect(res.status).toBe(400);
    expect(res.data.message).toEqual("Invalid name");
})

test("Testa email inválido", async () => {
    const body = {     
        name: "Otavio Miranda" , 
        email: `otaviomiranda23gmail.com` , 
        cpf: "42906972835", 
        carPlate: "cmg3164" , 
        isPassenger: true , 
        isDriver: false, 
        password: "1234568##Ot"
    }
    const res = await axios.post('http://localhost:3000/signup', body);
    expect(res.status).toBe(400);
    expect(res.data.message).toEqual("Invalid email");
})

test("Testa cpf inválido", async () => {
    const body = {     
        name: "Otavio Miranda" , 
        email: `otaviomiranda23${Math.random()}@gmail.com` , 
        cpf: "429069728358", 
        carPlate: "cmg3164" , 
        isPassenger: true , 
        isDriver: false, 
        password: "1234568##Ot"
    }
    const res = await axios.post('http://localhost:3000/signup', body);
    expect(res.status).toBe(400);
    expect(res.data.message).toEqual("Invalid cpf");
})

test("Testa usuário que é motorista (isDriver = true) com placa correta", async () => {
    const body = {     
        name: "Otavio Miranda" , 
        email: `otaviomiranda23${Math.random()}@gmail.com` , 
        cpf: "42906972835", 
        carPlate: "CMG3164" , 
        isPassenger: false , 
        isDriver: true, 
        password: "1234568##Ot"
    }
    const res = await axios.post('http://localhost:3000/signup', body);
    expect(res.data.accountId).toBeDefined();
    const resGetAccount = await axios.get(`http://localhost:3000/signup/${res.data.accountId}`);    
    expect(resGetAccount.data.name).toBe(body.name);
    expect(resGetAccount.data.email).toBe(body.email);
    expect(resGetAccount.data.cpf).toBe(body.cpf);
    expect(resGetAccount.data.car_plate).toBe(body.carPlate);
    expect(resGetAccount.data.is_passenger).toBe(body.isPassenger);
    expect(resGetAccount.data.is_driver).toBe(body.isDriver);
    expect(resGetAccount.data.password).toBe(body.password);
})

test("Testa usuário que é motorista (isDriver = true) com placa incorreta (minuscula)", async () => {
    const body = {     
        name: "Otavio Miranda" , 
        email: `otaviomiranda23${Math.random()}@gmail.com` , 
        cpf: "42906972835", 
        carPlate: "cmg3164" , 
        isPassenger: false , 
        isDriver: true, 
        password: "1234568##Ot"
    }
    const res = await axios.post('http://localhost:3000/signup', body);
    expect(res.status).toBe(400);
    expect(res.data.message).toEqual("Invalid car plate");
})