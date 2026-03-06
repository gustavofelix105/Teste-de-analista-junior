const orderModel = require('../models/order.model');

const mapIncomingOrder = (raw) => {
    return {
        orderId: raw.numeroPedido,
        value: Number(raw.valorTotal),
        // Ensures standard ISO string format matching the prompt requirement
        creationDate: new Date(raw.dataCriacao).toISOString(),
        items: raw.items?.map(i => ({
            productId: parseInt(i.idItem, 10),
            quantity: parseInt(i.quantidadeItem, 10),
            price: Number(i.valorItem)
        })) || []
    };
};

class OrderController {
    async create(req, res) {
        try {
            const rawBody = req.body;

            // Basic validation
            if (!rawBody.numeroPedido || rawBody.valorTotal === undefined) {
                return res.status(400).json({ error: 'Campos obrigatórios ausentes: numeroPedido, valorTotal.' });
            }

            // Map data
            const mappedData = mapIncomingOrder(rawBody);

            // Check if order already exists
            const existingOrder = await orderModel.getOrderById(mappedData.orderId);
            if (existingOrder) {
                return res.status(409).json({ error: 'Um pedido com este numeroPedido já existe.' });
            }

            // Save to DB
            const savedOrder = await orderModel.createOrder(mappedData);

            return res.status(201).json(savedOrder);
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            return res.status(500).json({ error: 'Erro interno no servidor ao tentar salvar o pedido.' });
        }
    }

    async getById(req, res) {
        try {
            const { orderId } = req.params;
            const order = await orderModel.getOrderById(orderId);

            if (!order) {
                return res.status(404).json({ error: 'Pedido não encontrado.' });
            }

            return res.status(200).json(order);
        } catch (error) {
            console.error('Erro ao buscar pedido:', error);
            return res.status(500).json({ error: 'Erro interno ao buscar o pedido.' });
        }
    }

    async list(req, res) {
        try {
            const orders = await orderModel.getAllOrders();
            return res.status(200).json(orders);
        } catch (error) {
            console.error('Erro ao listar pedidos:', error);
            return res.status(500).json({ error: 'Erro interno ao listar pedidos.' });
        }
    }

    async update(req, res) {
        try {
            const { orderId } = req.params;
            const order = await orderModel.getOrderById(orderId);

            if (!order) {
                return res.status(404).json({ error: 'Pedido não encontrado.' });
            }

            // In a real scenario, we might want to map fields differently for updates,
            // but for simplicity, we use the same mapping or update the subset
            const rawBody = req.body;
            const mappedData = {};
            if (rawBody.valorTotal !== undefined) mappedData.value = Number(rawBody.valorTotal);
            if (rawBody.dataCriacao !== undefined) mappedData.creationDate = new Date(rawBody.dataCriacao).toISOString();
            if (rawBody.items) {
                mappedData.items = rawBody.items.map(i => ({
                    productId: parseInt(i.idItem, 10),
                    quantity: parseInt(i.quantidadeItem, 10),
                    price: Number(i.valorItem)
                }));
            }

            const updatedOrder = await orderModel.updateOrder(orderId, mappedData);
            return res.status(200).json(updatedOrder);
        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);
            return res.status(500).json({ error: 'Erro interno ao atualizar pedido.' });
        }
    }

    async delete(req, res) {
        try {
            const { orderId } = req.params;
            const deleted = await orderModel.deleteOrder(orderId);

            if (!deleted) {
                return res.status(404).json({ error: 'Pedido não encontrado ou já deletado.' });
            }

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar pedido:', error);
            return res.status(500).json({ error: 'Erro interno ao deletar pedido.' });
        }
    }
}

module.exports = new OrderController();
