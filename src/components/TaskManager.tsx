'use client';

import { useState, useEffect } from 'react';
import { useVoice } from '@/contexts/VoiceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Task } from '@/types';
import { Plus, Calendar, Trash2, CheckCircle } from 'lucide-react';

export function TaskManager() {
  const { speak } = useVoice();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    crop: '',
    plantingDate: '',
    harvestDate: '',
    status: 'planning' as Task['status'],
    notes: '',
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem('weatherwise_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('weatherwise_tasks', JSON.stringify(updatedTasks));
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.crop || !newTask.plantingDate || !newTask.harvestDate) {
      speak('Please fill in all required fields');
      return;
    }

    const task: Task = {
      id: Math.random().toString(36).substring(7),
      ...newTask,
      plantingDate: new Date(newTask.plantingDate),
      harvestDate: new Date(newTask.harvestDate),
    };

    const updatedTasks = [...tasks, task];
    saveTasks(updatedTasks);
    speak(`Task added: ${task.title}`);

    setNewTask({
      title: '',
      crop: '',
      plantingDate: '',
      harvestDate: '',
      status: 'planning',
      notes: '',
    });
    setIsDialogOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    const updatedTasks = tasks.filter(t => t.id !== id);
    saveTasks(updatedTasks);
    speak(`Task deleted: ${task?.title}`);
  };

  const handleUpdateStatus = (id: string, status: Task['status']) => {
    const updatedTasks = tasks.map(t =>
      t.id === id ? { ...t, status } : t
    );
    saveTasks(updatedTasks);
    const task = tasks.find(t => t.id === id);
    speak(`Task status updated to ${status}`);
  };

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      planning: 'bg-blue-500',
      planted: 'bg-yellow-500',
      growing: 'bg-green-500',
      harvested: 'bg-purple-500',
    };
    return colors[status];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
            Tasks
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" aria-label="Add new task">
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new planting or harvesting task
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Task Title *</Label>
                  <Input
                    id="task-title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g., Plant tomatoes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-crop">Crop Type *</Label>
                  <Input
                    id="task-crop"
                    value={newTask.crop}
                    onChange={(e) => setNewTask({ ...newTask, crop: e.target.value })}
                    placeholder="e.g., Tomatoes, Corn, Wheat"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planting-date">Planting Date *</Label>
                    <Input
                      id="planting-date"
                      type="date"
                      value={newTask.plantingDate}
                      onChange={(e) => setNewTask({ ...newTask, plantingDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="harvest-date">Harvest Date *</Label>
                    <Input
                      id="harvest-date"
                      type="date"
                      value={newTask.harvestDate}
                      onChange={(e) => setNewTask({ ...newTask, harvestDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-status">Status</Label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value) => setNewTask({ ...newTask, status: value as Task['status'] })}
                  >
                    <SelectTrigger id="task-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="planted">Planted</SelectItem>
                      <SelectItem value="growing">Growing</SelectItem>
                      <SelectItem value="harvested">Harvested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-notes">Notes (Optional)</Label>
                  <Textarea
                    id="task-notes"
                    value={newTask.notes}
                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                    placeholder="Add any additional notes..."
                    rows={3}
                  />
                </div>

                <Button onClick={handleAddTask} className="w-full">
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No tasks yet. Add your first task to get started!
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">{task.crop}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                    aria-label={`Delete task: ${task.title}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">
                    Plant: {formatDate(task.plantingDate)}
                  </Badge>
                  <Badge variant="outline">
                    Harvest: {formatDate(task.harvestDate)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Select
                    value={task.status}
                    onValueChange={(value) => handleUpdateStatus(task.id, value as Task['status'])}
                  >
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="planted">Planted</SelectItem>
                      <SelectItem value="growing">Growing</SelectItem>
                      <SelectItem value="harvested">Harvested</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} aria-label={`Status: ${task.status}`} />
                </div>

                {task.notes && (
                  <p className="text-sm text-muted-foreground italic border-l-2 border-primary pl-3">
                    {task.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
