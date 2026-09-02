class ReadTimeFormatter {
  const ReadTimeFormatter._();

  /// Formats read time for badge (e.g., "~90 sec read", "~2 min read")
  static String formatReadBadge(int seconds) {
    if (seconds <= 0) return '< 1 min read';
    if (seconds < 60) return '~$seconds sec read';
    if (seconds <= 90) return '~90 sec read';

    final minutes = (seconds / 60).round();
    return '~$minutes min read';
  }

  /// Formats short read time (e.g. "90s", "2m", "15m")
  static String formatShort(int seconds) {
    if (seconds < 60) return '${seconds}s';
    final minutes = (seconds / 60).round();
    return '${minutes}m';
  }

  /// Formats course duration (e.g. "18 mins", "1 hr 15 mins")
  static String formatCourseDuration(int totalSeconds) {
    if (totalSeconds < 60) {
      return '< 1 min';
    }
    final totalMinutes = (totalSeconds / 60).round();
    if (totalMinutes < 60) {
      return '$totalMinutes ${totalMinutes == 1 ? 'min' : 'mins'}';
    }

    final hours = totalMinutes ~/ 60;
    final remainingMinutes = totalMinutes % 60;
    if (remainingMinutes == 0) {
      return '$hours ${hours == 1 ? 'hr' : 'hrs'}';
    }
    return '$hours ${hours == 1 ? 'hr' : 'hrs'} $remainingMinutes ${remainingMinutes == 1 ? 'min' : 'mins'}';
  }
}
