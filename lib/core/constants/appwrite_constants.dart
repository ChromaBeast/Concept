class AppwriteConstants {
  const AppwriteConstants._();

  // Project Configuration
  static const String endpoint = 'https://cloud.appwrite.io/v1';
  static const String projectId = 'concept-app';
  static const String databaseId = 'concept_db';

  // Collection IDs (Spec §7)
  static const String collectionConcepts = 'concepts';
  static const String collectionTags = 'tags';
  static const String collectionCourses = 'courses';
  static const String collectionRoadmapTopics = 'roadmapTopics';
  static const String collectionPipelineRuns = 'pipelineRuns';
  static const String collectionUsers = 'users';
  static const String collectionCourseProgress = 'courseProgress';
  static const String collectionAnalyticsEvents = 'analyticsEvents';

  // Storage Buckets (Spec §4.4, §7)
  static const String bucketConceptImages = 'concept-images';

  // Realtime Channels
  static String conceptDocumentChannel(String conceptId) =>
      'databases.$databaseId.collections.$collectionConcepts.documents.$conceptId';

  static String conceptsCollectionChannel() =>
      'databases.$databaseId.collections.$collectionConcepts.documents';

  static String coursesCollectionChannel() =>
      'databases.$databaseId.collections.$collectionCourses.documents';
}
