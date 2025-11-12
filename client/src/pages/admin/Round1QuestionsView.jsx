import React from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';

const mockR1Questions = [
  { id: 1, text: 'What is the time complexity of a binary search?', type: 'MCQ' },
  { id: 2, text: 'Explain the difference between a list and a tuple in Python.', type: 'Short Answer' },
];

const Round1QuestionsView = ()=> (
  <div>
    <h2 className="text-2xl font-bold text-white mb-6">Round 1 Question Bank</h2>
    <Button className="mb-6">Add New Question (MCQ)</Button>
    <div className="space-y-4">
      {mockR1Questions.map(q => (
        <Card key={q.id} className="bg-gray-700 p-4">
          <p className="text-white">{q.text}</p>
          <div className="text-right space-x-2 mt-2">
            <Button variant="secondary" className="py-1 px-2 text-xs">Edit</Button>
            <Button variant="secondary" className="py-1 px-2 text-xs !bg-red-800 hover:!bg-red-700">Delete</Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default Round1QuestionsView;