import request from 'supertest';
import web from '../src/application/web';

describe('task-controller', () => {    

    describe('Task routes', () => {
        it('Create a new task', async () => {
            const response = await request(web)
                .post(`/api/users/3/tasks`)
                .set('Authorization', `Bearer 6c3f0bdb-5b1f-46f8-a66c-f9c2285e1dae`)
                .send({
                    title: 'New Task',
                    description: 'Task description',
                });
            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('id');
        });

        it('Get a task', async () => {
            const response = await request(web)
                .get(`/api/users/3/tasks/2`)
                .set('Authorization', `Bearer 6c3f0bdb-5b1f-46f8-a66c-f9c2285e1dae`);
            expect(response.status).toBe(200);
            // Add more assertions for the task details if needed
        });

        it('Update a task', async () => {
            const response = await request(web)
                .put(`/api/users/3/tasks/2`)
                .set('Authorization', `Bearer 6c3f0bdb-5b1f-46f8-a66c-f9c2285e1dae`)
                .send({
                    title: 'Updated Task',
                    description: 'Updated task description',
                });
            expect(response.status).toBe(200);
            // Add more assertions for the updated task details if needed
        });

        // it('Remove a task', async () => {
        //     const response = await request(web)
        //         .delete(`/api/users/2/tasks/1`)
        //         .set('Authorization', `Bearer ${authToken}`);
        //     expect(response.status).toBe(200);
        // });

        it('Search tasks', async () => {
            const response = await request(web)
                .get(`/api/users/3/tasks`)
                .set('Authorization', `Bearer 6c3f0bdb-5b1f-46f8-a66c-f9c2285e1dae`)
                .query({
                    title: 'Search Keyword',
                });
            expect(response.status).toBe(200);
            // Add more assertions for the search results if needed
        });
    });

    // Add more tests for other task routes if needed
});
