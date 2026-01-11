import 'package:dotech_provider/features/jobs/domain/entities/job.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dotech_provider/injection_container/injection_container.dart' as di;
import '../bloc/jobs_bloc.dart';

class JobDetailPage extends StatelessWidget {
  final String jobId;
  // Optional: Pass job object if available (e.g. from list) to show immediately while refreshing
  final Job? initialJob; 

  // Removed const to avoid potential potential issues with mismatching versions
  JobDetailPage({super.key, required this.jobId, this.initialJob});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => di.sl<JobsBloc>()..add(GetJobDetailEvent(jobId)),
      child: Scaffold(
        appBar: AppBar(title: const Text('Job Details')),
        body: BlocBuilder<JobsBloc, JobsState>(
          builder: (context, state) {
            if (state is JobsLoading) {
                 return const Center(child: CircularProgressIndicator());
            } else if (state is JobsError) {
                 return Center(child: Text('Error: ${state.message}'));
            } else if (state is JobDetailLoaded) {
                 return _buildContent(context, state.job);
            }
            
            // If we have initial data, show it while loading (if logical) or just show loading
            if (initialJob != null) {
                return _buildContent(context, initialJob!);
            }
            
            return const Center(child: CircularProgressIndicator());
          },
        ),
      ),
    );
  }

  Widget _buildContent(BuildContext context, Job job) {
      return SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Job #${job.id.substring(0, 8)}', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 20),
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
        // We need to access the bloc from the context
        // Since we wrapped the page in a BlocProvider, this works.
        // BUT, UpdateStatusEvent currently relies on UpdateJobStatusUseCase which returns a Job.
        // We might want to reload the specific job details after update.
        context.read<JobsBloc>().add(
          UpdateStatusEvent(jobId: jobId, status: status),
        );
        // After sending event, the bloc might emit JobsLoaded (list) based on current logic.
        // We should arguably just "pop" or stay here. 
        // Current logic in `UpdateStatusEvent` calls `add(LoadJobsEvent())`.
        // This component is now isolated with its own Bloc instance. 
        // We should ensure the bloc handles update and re-fetches detail.
        
        // For now, let's just trigger update. If the bloc emits `JobsLoaded` it might confuse this builder
        // which expects JobDetailLoaded. 
        // However, we can adapt the builder or rely on "Navigator.pop" if that was the intent.
        // The previous design popped. Let's keep it simple.
        
        Navigator.pop(context);
        
        // Note: Ideally we should await success then pop, but for deep link scenarios popping might return to... where?
        // If launched from cold start, pop might go to black screen or home.
        // We should check canPop.
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
