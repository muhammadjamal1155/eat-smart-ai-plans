
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Plus, Edit, Trash2, Calendar, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  title: string;
  category: 'weight' | 'nutrition' | 'fitness' | 'health';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

const GoalTracking = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Reach Target Weight',
      category: 'weight',
      target: 70,
      current: 71.2,
      unit: 'kg',
      deadline: '2024-04-15',
      status: 'active',
      priority: 'high',
      description: 'Lose 5kg for better health and fitness'
    },
    {
      id: '2',
      title: 'Increase Daily Protein',
      category: 'nutrition',
      target: 120,
      current: 105,
      unit: 'g',
      deadline: '2024-03-30',
      status: 'active',
      priority: 'medium',
      description: 'Support muscle growth and recovery'
    },
    {
      id: '3',
      title: 'Drink More Water',
      category: 'health',
      target: 8,
      current: 6.5,
      unit: 'glasses',
      deadline: '2024-03-25',
      status: 'active',
      priority: 'medium',
      description: 'Improve hydration and overall health'
    },
    {
      id: '4',
      title: 'Reduce Sugar Intake',
      category: 'nutrition',
      target: 25,
      current: 35,
      unit: 'g',
      deadline: '2024-04-01',
      status: 'active',
      priority: 'high',
      description: 'Limit added sugars to WHO recommendations'
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'nutrition' as Goal['category'],
    target: 0,
    current: 0,
    unit: '',
    deadline: '',
    priority: 'medium' as Goal['priority'],
    description: ''
  });

  const [showNewGoalForm, setShowNewGoalForm] = useState(false);

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      status: 'active'
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      category: 'nutrition',
      target: 0,
      current: 0,
      unit: '',
      deadline: '',
      priority: 'medium',
      description: ''
    });
    setShowNewGoalForm(false);

    toast({
      title: "Goal Created",
      description: "Your new goal has been added successfully!",
    });
  };

  const handleUpdateProgress = (goalId: string, newProgress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, current: newProgress, status: newProgress >= goal.target ? 'completed' : 'active' }
        : goal
    ));

    const goal = goals.find(g => g.id === goalId);
    if (goal && newProgress >= goal.target) {
      toast({
        title: "Goal Completed! 🎉",
        description: `Congratulations! You've achieved your goal: ${goal.title}`,
      });
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
    toast({
      title: "Goal Deleted",
      description: "The goal has been removed.",
    });
  };

  const getProgressPercentage = (goal: Goal) => {
    if (goal.category === 'weight' && goal.current < goal.target) {
      // For weight loss, calculate differently
      const totalToLose = 75 - goal.target; // Assuming starting weight of 75kg
      const lost = 75 - goal.current;
      return Math.min((lost / totalToLose) * 100, 100);
    }
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'weight': return '⚖️';
      case 'nutrition': return '🥗';
      case 'fitness': return '🏃';
      case 'health': return '💪';
      default: return '🎯';
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Goal Tracking</h2>
          <p className="text-gray-600">Set, track, and achieve your nutrition goals</p>
        </div>
        <Button onClick={() => setShowNewGoalForm(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold">
                  {Math.round(activeGoals.reduce((acc, goal) => acc + getProgressPercentage(goal), 0) / activeGoals.length || 0)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Goal Form */}
      {showNewGoalForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="e.g., Increase daily fiber intake"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value as Goal['category']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nutrition">🥗 Nutrition</SelectItem>
                    <SelectItem value="weight">⚖️ Weight</SelectItem>
                    <SelectItem value="fitness">🏃 Fitness</SelectItem>
                    <SelectItem value="health">💪 Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="target">Target Value *</Label>
                <Input
                  id="target"
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="current">Current Value</Label>
                <Input
                  id="current"
                  type="number"
                  value={newGoal.current}
                  onChange={(e) => setNewGoal({...newGoal, current: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                  placeholder="e.g., g, kg, glasses"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({...newGoal, priority: value as Goal['priority']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="Optional description or notes"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddGoal} className="btn-primary">
                Create Goal
              </Button>
              <Button variant="outline" onClick={() => setShowNewGoalForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Goals ({activeGoals.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedGoals.length})</TabsTrigger>
          <TabsTrigger value="all">All Goals ({goals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeGoals.map((goal) => (
            <Card key={goal.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteGoal(goal.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {goal.current} / {goal.target} {goal.unit}</span>
                    <span>{Math.round(getProgressPercentage(goal))}% complete</span>
                  </div>
                  <Progress value={getProgressPercentage(goal)} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={goal.current}
                        onChange={(e) => handleUpdateProgress(goal.id, parseFloat(e.target.value))}
                        className="w-20 h-8"
                        step="0.1"
                      />
                      <span className="text-sm text-gray-600">{goal.unit}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedGoals.map((goal) => (
            <Card key={goal.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      <p className="text-sm text-gray-600">
                        Completed: {goal.current} {goal.unit} (Target: {goal.target} {goal.unit})
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {goal.current} / {goal.target} {goal.unit}</span>
                    <span>{Math.round(getProgressPercentage(goal))}% complete</span>
                  </div>
                  <Progress value={getProgressPercentage(goal)} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoalTracking;
