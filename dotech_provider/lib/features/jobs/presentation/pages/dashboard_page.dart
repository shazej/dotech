import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/jobs_bloc.dart';
import 'job_detail_page.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  @override
  void initState() {
    super.initState();
    context.read<JobsBloc>().add(LoadJobsEvent());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Provider Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => context.read<JobsBloc>().add(LoadJobsEvent()),
          ),
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {},
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const _StatsOverview(),
            const SizedBox(height: 24),
            const Text(
              'My Jobs',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: BlocBuilder<JobsBloc, JobsState>(
                builder: (context, state) {
                  if (state is JobsLoading) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (state is JobsLoaded) {
                    if (state.jobs.isEmpty) {
                      return const Center(child: Text('No jobs assigned yet.'));
                    }
                    return ListView.builder(
                      itemCount: state.jobs.length,
                      itemBuilder: (context, index) {
                        final job = state.jobs[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: _getStatusColor(job.status).withOpacity(0.1),
                              child: Icon(Icons.work, color: _getStatusColor(job.status)),
                            ),
                            title: Text('Job #${job.id.substring(0, 8)}'),
                            subtitle: Text('Status: ${job.status.toUpperCase()}'),
                            trailing: const Icon(Icons.chevron_right),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => JobDetailPage(job: job)),
                              );
                            },
                          ),
                        );
                      },
                    );
                  } else if (state is JobsError) {
                    return Center(child: Text('Error: ${state.message}'));
                  }
                  return const SizedBox();
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'requested': return Colors.orange;
      case 'accepted': return Colors.blue;
      case 'on_the_way': return Colors.purple;
      case 'completed': return Colors.green;
      default: return Colors.grey;
    }
  }
}

class _StatsOverview extends StatelessWidget {
  const _StatsOverview();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _buildStatCard('Active', '2', Colors.blue),
        const SizedBox(width: 12),
        _buildStatCard('Completed', '15', Colors.green),
        const SizedBox(width: 12),
        _buildStatCard('Revenue', '$1.2k', Colors.teal),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Text(label, style: TextStyle(color: color, fontWeight: FontWeight.w600, fontSize: 12)),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
