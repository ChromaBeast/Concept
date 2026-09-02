import 'package:flutter/material.dart';
import '../../data/models/enums.dart';

/// High-level domain clusters grouping 16 categories for reduced cognitive load.
enum CategoryDomain {
  all('All Domains', Icons.grid_view_rounded, Category.values),
  coreCs(
    'Core CS',
    Icons.memory_rounded,
    [
      Category.dsa,
      Category.databases,
      Category.operatingSystems,
      Category.networking,
    ],
  ),
  systemsCloud(
    'Systems & Cloud',
    Icons.cloud_queue_rounded,
    [
      Category.systemDesign,
      Category.cloud,
      Category.devopsInfra,
      Category.security,
    ],
  ),
  softwareDev(
    'Software & Web',
    Icons.code_rounded,
    [
      Category.frontend,
      Category.backend,
      Category.oopDesignPatterns,
      Category.languageSpecific,
    ],
  ),
  practicesCareer(
    'Practices & Career',
    Icons.psychology_rounded,
    [
      Category.testingQa,
      Category.versionControl,
      Category.mlBasics,
      Category.behavioralInterview,
    ],
  );

  const CategoryDomain(this.label, this.icon, this.categories);

  final String label;
  final IconData icon;
  final List<Category> categories;

  bool contains(Category cat) => categories.contains(cat);
}
