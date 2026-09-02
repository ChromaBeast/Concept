'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { adminApi } from '@/lib/adminApi';
import { Course } from '@/lib/types';
import { formatSecondsToMinutes } from '@/lib/utils';

export function CoursesTab() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    setLoading(true);
    const data = await adminApi.getCourses();
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between p-4 rounded-2xl border border-paper-border bg-paper-card shadow-sm">
        <div className="space-y-1">
          <div className="text-sm font-bold text-paper-text font-sans flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-ochre" />
            <span>Curated Study Tracks</span>
          </div>
          <p className="text-xs text-paper-muted">
            Ordered concept playlists assembled by the weekly curation pipeline.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={loadCourses} loading={loading}>
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.$id} className="p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="accent">{course.primaryCategory}</Badge>
              <Badge variant="outline">{course.difficulty}</Badge>
            </div>

            <div>
              <h4 className="font-bold text-base text-paper-text font-sans mb-1">{course.title}</h4>
              <p className="text-xs text-paper-muted line-clamp-2 leading-relaxed">{course.description}</p>
            </div>

            <div className="pt-3 border-t border-paper-border flex items-center justify-between text-[11px] text-paper-muted">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-ochre" />
                {course.conceptIds?.length || 0} Concepts
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-ochre" />
                {formatSecondsToMinutes(course.totalReadSeconds || 540)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
