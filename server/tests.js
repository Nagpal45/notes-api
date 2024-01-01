import assert from 'assert';
import request from 'supertest';
import app from './index.js';

describe('User API', () => {
  let createdNoteId;

  const authCredentials = Buffer.from('admin:12345678').toString('base64');
  const authHeader = `Basic ${authCredentials}`;

  it('should create a new note', async () => {
    const response = await request(app)
      .post('/create')
      .set('Authorization', authHeader)
      .send({ title: 'Test Note', content: 'This is a test note' });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.title, 'Test Note');
    assert.strictEqual(response.body.content, 'This is a test note');

    createdNoteId = response.body._id;
  });

  it('should get all notes', async () => {
    const response = await request(app)
      .get('/notes')
      .set('Authorization', authHeader);

    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  it('should get a specific note', async () => {
    const response = await request(app)
      .get(`/note/${createdNoteId}`)
      .set('Authorization', authHeader);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body._id, createdNoteId);
  });

  it('should update a note', async () => {
    const response = await request(app)
      .put(`/update/${createdNoteId}`)
      .set('Authorization', authHeader)
      .send({ title: 'Updated Note', content: 'This note has been updated' });

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.title, 'Updated Note');
    assert.strictEqual(response.body.content, 'This note has been updated');
  });

  it('should delete a note', async () => {
    const response = await request(app)
      .delete(`/delete/${createdNoteId}`)
      .set('Authorization', authHeader);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.message, 'Note deleted successfully');
  });

  it('should handle not found error when getting a specific note', async () => {
    const response = await request(app)
      .get('/note/6592beff1e81a2f66477d321')
      .set('Authorization', authHeader);

    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.error, 'Note not found');
  });

  it('should handle not found error when updating a note', async () => {
    const response = await request(app)
      .put('/update/6592beff1e81a2f66477d321')
      .set('Authorization', authHeader)
      .send({ title: 'Updated Note', content: 'This note has been updated' });

    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.error, 'Note not found');
  });

  it('should handle not found error when deleting a note', async () => {
    const response = await request(app)
      .delete('/delete/6592beff1e81a2f66477d321')
      .set('Authorization', authHeader);

    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.error, 'Note not found');
  });
});
