import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';

/// Syntax-styled code box with language tag, line numbers, and copy-to-clipboard button.
class CodeBlockView extends StatefulWidget {
  const CodeBlockView({
    super.key,
    required this.code,
    this.language,
    this.showLineNumbers = true,
    this.showCopyButton = true,
    this.margin = EdgeInsets.zero,
  });

  final String code;
  final String? language;
  final bool showLineNumbers;
  final bool showCopyButton;
  final EdgeInsetsGeometry margin;

  @override
  State<CodeBlockView> createState() => _CodeBlockViewState();
}

class _CodeBlockViewState extends State<CodeBlockView> {
  bool _copied = false;
  Timer? _copiedTimer;

  @override
  void dispose() {
    _copiedTimer?.cancel();
    super.dispose();
  }

  void _copyToClipboard() {
    Clipboard.setData(ClipboardData(text: widget.code));
    setState(() => _copied = true);
    _copiedTimer?.cancel();
    _copiedTimer = Timer(const Duration(seconds: 2), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final lines = widget.code.split('\n');

    return Padding(
      padding: widget.margin,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.darkBackground,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.darkBorder, width: 1),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildHeader(),
            const Divider(color: AppColors.darkBorderSubtle, height: 1),
            _buildCodeContent(lines),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    final langLabel = (widget.language ?? 'code').toUpperCase();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      color: AppColors.darkSurface,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: AppColors.darkSurfaceVariant,
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: AppColors.darkBorderSubtle, width: 0.8),
            ),
            child: Text(
              langLabel,
              style: const TextStyle(
                fontSize: 10.5,
                fontWeight: FontWeight.w600,
                color: AppColors.darkTextSecondary,
                letterSpacing: 0.5,
              ),
            ),
          ),
          if (widget.showCopyButton)
            InkWell(
              onTap: _copyToClipboard,
              borderRadius: BorderRadius.circular(4),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      _copied ? Icons.check_rounded : Icons.copy_rounded,
                      size: 13,
                      color: _copied ? AppColors.success : AppColors.darkTextSecondary,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _copied ? 'Copied!' : 'Copy',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                        color: _copied ? AppColors.success : AppColors.darkTextSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildCodeContent(List<String> lines) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.all(12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (widget.showLineNumbers) ...[
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: List.generate(lines.length, (i) {
                return Text(
                  '${i + 1}',
                  style: AppTypography.codeSnippet.copyWith(
                    color: AppColors.darkTextTertiary,
                  ),
                );
              }),
            ),
            const SizedBox(width: 14),
            Container(width: 1, height: lines.length * 19.5, color: AppColors.darkBorderSubtle),
            const SizedBox(width: 14),
          ],
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: lines.map((line) {
              return Text(
                line.isEmpty ? ' ' : line,
                style: AppTypography.codeSnippet.copyWith(
                  color: AppColors.darkTextPrimary,
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
