import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dotech_provider/features/jobs/domain/entities/job.dart';
import '../bloc/jobs_bloc.dart';

class JobDetailPage extends StatelessWidget {
  final Job job;
  const JobDetailPage({super.key, required this.job});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Job Detail #${job.id.substring(0, 8)}')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoCard(
              context,
              title: 'Schedule',
              icon: Icons.calendar_today,
              value: job.scheduledAt.toString(),
            ),
            const SizedBox(height: 16),
            _buildInfoCard(
              context,
              title: 'Status',
              icon: Icons.info_outline,
              value: job.status.toUpperCase(),
              valueColor: Colors.indigo,
            ),
            const SizedBox(height: 16),
            _buildInfoCard(
              context,
              title: 'Location ID',
              icon: Icons.location_on,
              value: job.addressId,
            ),
            const SizedBox(height: 40),
            const Text(
              'Update Status',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                _StatusButton(
                  jobId: job.id,
                  status: 'accepted',
                  label: 'Accept',
                ),
                _StatusButton(
                  jobId: job.id,
                  status: 'on_the_way',
                  label: 'On The Way',
                ),
                _StatusButton(
                  jobId: job.id,
                  status: 'completed',
                  label: 'Complete',
                ),
                _StatusButton(
                  jobId: job.id,
                  status: 'cancelled',
                  label: 'Cancel',
                  color: Colors.red,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required String value,
    Color? valueColor,
  }) {
    return Card(
      child: ListTile(
        leading: Icon(icon, color: Colors.indigo),
        title: Text(
          title,
          style: TextStyle(color: Colors.grey[600], fontSize: 14),
        ),
        subtitle: Text(
          value,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: valueColor,
          ),
        ),
      ),
    );
  }
}

class _StatusButton extends StatelessWidget {
  final String jobId;
  final String status;
  final String label;
  final Color? color;

  const _StatusButton({
    required this.jobId,
    required this.status,
    required this.label,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {
        context.read<JobsBloc>().add(
          UpdateStatusEvent(jobId: jobId, status: status),
        );
        Navigator.pop(context);
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: color ?? Colors.indigo,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
      child: Text(label),
    );
  }
}
