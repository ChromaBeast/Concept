import 'package:flutter/material.dart';
import '../../data/models/enums.dart';
import '../theme/app_colors.dart';

class CategoryUtils {
  const CategoryUtils._();

  static String getDisplayName(Category category) => category.label;

  static String getSlug(Category category) => category.value;

  static Category fromSlug(String slug) => Category.fromValue(slug);

  static Color getAccentColor(Category category) {
    switch (category) {
      case Category.dsa:
        return AppColors.catDsa;
      case Category.systemDesign:
        return AppColors.catSystemDesign;
      case Category.databases:
        return AppColors.catDatabases;
      case Category.operatingSystems:
        return AppColors.catOperatingSystems;
      case Category.networking:
        return AppColors.catNetworking;
      case Category.oopDesignPatterns:
        return AppColors.catOopDesignPatterns;
      case Category.frontend:
        return AppColors.catFrontend;
      case Category.backend:
        return AppColors.catBackend;
      case Category.devopsInfra:
        return AppColors.catDevopsInfra;
      case Category.security:
        return AppColors.catSecurity;
      case Category.testingQa:
        return AppColors.catTestingQa;
      case Category.versionControl:
        return AppColors.catVersionControl;
      case Category.cloud:
        return AppColors.catCloud;
      case Category.mlBasics:
        return AppColors.catMlBasics;
      case Category.behavioralInterview:
        return AppColors.catBehavioralInterview;
      case Category.languageSpecific:
        return AppColors.catLanguageSpecific;
    }
  }

  static IconData getIcon(Category category) {
    switch (category) {
      case Category.dsa:
        return Icons.account_tree_outlined;
      case Category.systemDesign:
        return Icons.hub_outlined;
      case Category.databases:
        return Icons.storage_outlined;
      case Category.operatingSystems:
        return Icons.memory_outlined;
      case Category.networking:
        return Icons.lan_outlined;
      case Category.oopDesignPatterns:
        return Icons.category_outlined;
      case Category.frontend:
        return Icons.web_outlined;
      case Category.backend:
        return Icons.dns_outlined;
      case Category.devopsInfra:
        return Icons.cloud_sync_outlined;
      case Category.security:
        return Icons.security_outlined;
      case Category.testingQa:
        return Icons.fact_check_outlined;
      case Category.versionControl:
        return Icons.fork_right_outlined;
      case Category.cloud:
        return Icons.cloud_outlined;
      case Category.mlBasics:
        return Icons.psychology_outlined;
      case Category.behavioralInterview:
        return Icons.record_voice_over_outlined;
      case Category.languageSpecific:
        return Icons.code_outlined;
    }
  }
}
