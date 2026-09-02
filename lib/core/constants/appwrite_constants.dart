class AppwriteConstants {
  const AppwriteConstants._();

  // Project Configuration
  static const String endpoint = 'https://sgp.cloud.appwrite.io/v1';
  static const String projectId = '6a97fc420033ed1fefd0';
  static const String databaseId = '6a97fc7c0037107a5f9a';

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
  static const String bucketConceptImages = '6a97fca9001531fa17f7';

  // Realtime Channels
  static String conceptDocumentChannel(String conceptId) =>
      'databases.$databaseId.collections.$collectionConcepts.documents.$conceptId';

  static String conceptsCollectionChannel() =>
      'databases.$databaseId.collections.$collectionConcepts.documents';

  static String coursesCollectionChannel() =>
      'databases.$databaseId.collections.$collectionCourses.documents';
}
