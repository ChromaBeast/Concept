import 'package:flutter/material.dart';

/// Reusable CustomPainter that draws the glowing Concept bracket and neural core emblem.
class ConceptLogoPainter extends CustomPainter {
  const ConceptLogoPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width * 0.38;

    final outerPaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFBBF24), Color(0xFFD97706), Color(0xFF14B8A6)],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6.0
      ..strokeCap = StrokeCap.round;

    final path = Path()
      ..addArc(
        Rect.fromCircle(center: center, radius: radius),
        0.7,
        4.8,
      );
    canvas.drawPath(path, outerPaint);

    // Inner core node
    final corePaint = Paint()
      ..color = const Color(0xFFD97706)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, 7.0, corePaint);

    final coreDot = Paint()..color = Colors.white;
    canvas.drawCircle(center, 3.0, coreDot);

    // Connecting ray
    final rayPaint = Paint()
      ..color = const Color(0xFFFBBF24).withValues(alpha: 0.8)
      ..strokeWidth = 3.0;
    canvas.drawLine(center, Offset(size.width * 0.76, size.height * 0.28), rayPaint);

    // Upper and lower node anchors
    final upperNode = Paint()..color = const Color(0xFFFBBF24);
    canvas.drawCircle(Offset(size.width * 0.76, size.height * 0.28), 4.5, upperNode);

    final lowerNode = Paint()..color = const Color(0xFF14B8A6);
    canvas.drawCircle(Offset(size.width * 0.76, size.height * 0.72), 4.5, lowerNode);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
