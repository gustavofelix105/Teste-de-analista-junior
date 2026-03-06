const { getDbConnection } = require('../database/db');

class OrderModel {
    async createOrder(orderData) {
        const db = await getDbConnection();
        const { orderId, value, creationDate, items } = orderData;

        await db.run('BEGIN TRANSACTION');
        try {
            await db.run(
                'INSERT INTO Orders (orderId, value, creationDate) VALUES (?, ?, ?)',
                [orderId, value, creationDate]
            );

            for (const item of items) {
                await db.run(
                    'INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.productId, item.quantity, item.price]
                );
            }
            await db.run('COMMIT');
            return await this.getOrderById(orderId);
        } catch (error) {
            await db.run('ROLLBACK');
            throw error;
        }
    }

    async getOrderById(orderId) {
        const db = await getDbConnection();
        const order = await db.get('SELECT * FROM Orders WHERE orderId = ?', [orderId]);
        if (!order) return null;

        const items = await db.all('SELECT productId, quantity, price FROM Items WHERE orderId = ?', [orderId]);
        order.items = items;
        return order;
    }

    async getAllOrders() {
        const db = await getDbConnection();
        const orders = await db.all('SELECT * FROM Orders');
        const items = await db.all('SELECT orderId, productId, quantity, price FROM Items');

        return orders.map(order => {
            order.items = items
                .filter(item => item.orderId === order.orderId)
                .map(({ productId, quantity, price }) => ({ productId, quantity, price }));
            return order;
        });
    }

    async updateOrder(orderId, updateData) {
        const db = await getDbConnection();
        const { value, creationDate, items } = updateData;

        await db.run('BEGIN TRANSACTION');
        try {
            // Update order values if provided
            if (value !== undefined || creationDate !== undefined) {
                const currentOrder = await db.get('SELECT * FROM Orders WHERE orderId = ?', [orderId]);
                const newValue = value !== undefined ? value : currentOrder.value;
                const newDate = creationDate !== undefined ? creationDate : currentOrder.creationDate;

                await db.run(
                    'UPDATE Orders SET value = ?, creationDate = ? WHERE orderId = ?',
                    [newValue, newDate, orderId]
                );
            }

            // Update items if provided (replacing old ones)
            if (items && Array.isArray(items)) {
                await db.run('DELETE FROM Items WHERE orderId = ?', [orderId]);
                for (const item of items) {
                    await db.run(
                        'INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
                        [orderId, item.productId, item.quantity, item.price]
                    );
                }
            }

            await db.run('COMMIT');
            return await this.getOrderById(orderId);
        } catch (error) {
            await db.run('ROLLBACK');
            throw error;
        }
    }

    async deleteOrder(orderId) {
        const db = await getDbConnection();
        // Since sqlite allows PRAGMA foreign_keys = ON, but we might not have enabled it explicitly per connection
        // Let's delete items first manually
        await db.run('BEGIN TRANSACTION');
        try {
            await db.run('DELETE FROM Items WHERE orderId = ?', [orderId]);
            const result = await db.run('DELETE FROM Orders WHERE orderId = ?', [orderId]);
            await db.run('COMMIT');
            return result.changes > 0;
        } catch (error) {
            await db.run('ROLLBACK');
            throw error;
        }
    }
}

module.exports = new OrderModel();
